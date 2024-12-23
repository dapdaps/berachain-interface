import { LucideIcon, ScrollTextIcon, VaultIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { create } from "zustand";
import {
  isSolidityAddressValid,
  isSolidityStringValid
} from "royco/utils";

import {
  AbiParameter as ZodAbiParameter,
  AbiFunction as ZodAbiFunction,
} from "abitype/zod";

import {
  isFixedValueValid,
  isMarketActionScriptValid,
  isMarketActionValid,
} from "royco/market";

export const ZodChain = z.object({
  id: z.number(),
  name: z.string(),
  rpcUrls: z.object({
    default: z.object({
      http: z.array(z.string()),
    }),
  }),
  blockExplorers: z
    .object({
      default: z.object({
        name: z.string(),
        url: z.string(),
      }),
    })
    .optional(),
  testnet: z.boolean().optional(),
  nativeCurrency: z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
  }),
  image: z.string(),
  symbol: z.string(),
});


export const TypedZodAbiFunction = z.object({
  type: z.literal("function"),
  name: z.string().regex(/[a-zA-Z$_][a-zA-Z0-9$_]*/),
  inputs: z.array(ZodAbiParameter).readonly(),
  outputs: z.array(ZodAbiParameter).readonly(),
  constant: z.any().optional(),
});

export const ZodAction = z
  .object({
    id: z.string(),
    contract_address: z.string().refine(
      (value) => {
        return isSolidityAddressValid("address", value);
      },
      {
        message: "Invalid contract address",
      }
    ),
    contract_name: z.string().optional(),
    contract_image: z.string().optional(),
    contract_function: TypedZodAbiFunction,
    inputs: z.array(
      z.object({
        input_type: z.enum(["fixed", "dynamic"]),
        fixed_value: z.string().optional(),
        dynamic_value: z
          .object({
            action_id: z.string(),
            action_index: z.number(),
            output_index: z.number(),
          })
          .optional(),
      })
    ),
  })
  .refine(
    (schema) => {
      return schema.inputs.every((input, inputIndex) => {
        if (input.input_type === "fixed") {
          if (input.fixed_value === undefined) return false;

          const actual_input_type =
            schema.contract_function.inputs[inputIndex].type;

          const isValid = isFixedValueValid({
            type: actual_input_type,
            value: input.fixed_value,
          });

          return isValid.status;
        } else {
          return input.dynamic_value !== undefined;
        }
      });
    },
    {
      message: "Invalid input values",
      path: ["inputs"],
    }
  );

export const ZodActions = z.array(ZodAction).refine(
  (actions) => {
    const { status, message } = isMarketActionScriptValid({
      /**
       * @TODO Strictly type this
       */
      // @ts-ignore
      marketActions: actions,
    });

    return status;
  },
  {
    message: "Invalid Action",
  }
);


export const LockupTimeMap: Record<
  string,
  {
    offer: number;
    notation: string;
    label: string;
    multiplier: number;
  }
> = {
  minutes: {
    offer: 1,
    notation: "min",
    label: "Minutes",
    multiplier: 60,
  },
  hours: {
    offer: 2,
    notation: "hr",
    label: "Hours",
    multiplier: 3600,
  },
  days: {
    offer: 3,
    notation: "d",
    label: "Days",
    multiplier: 86400,
  },
  weeks: {
    offer: 4,
    notation: "wk",
    label: "Weeks",
    multiplier: 604800,
  },
  months: {
    offer: 5,
    notation: "mo",
    label: "Months",
    multiplier: 2592000,
  },
  years: {
    offer: 6,
    notation: "yr",
    label: "Years",
    multiplier: 31536000,
  },
};

export const MarketBuilderFormSchema = z.object({
  chain: ZodChain,

  action_type: z.enum(["recipe", "vault"]),
  incentive_schedule: z.enum(["upfront", "arrear", "forfeitable", "streaming"]),

  vault_address: z
    .string()
    .optional()
    .refine(
      (value) => {
        return isSolidityAddressValid("address", value);
      },
      {
        message: "Invalid address value",
      }
    ),

  // @finalized
  market_name: z
    .string()
    .min(3, {
      message: "Market Name must be at least 3 characters long",
    })
    .max(100, {
      message: "Market Name must be at most 100 characters long",
    })
    .refine(
      (value) => {
        return isSolidityStringValid("string", value);
      },
      {
        message: "Market Name contains invalid characters",
      }
    ),

  // @finalized
  market_description: z
    .string()
    .min(10, {
      message: "Market Description must be at least 10 characters long",
    })
    .max(1000, {
      message: "Market Description must be at most 1000 characters long",
    }),

  asset: z.object(
    {
      id: z.string(),
      chain_id: z.number(),
      contract_address: z.string(),
      symbol: z.string(),
      image: z.string(),
      decimals: z.number(),
    },
    {
      message: "Asset must be selected",
    }
  ),

  enter_actions: ZodActions,
  exit_actions: ZodActions,

  expiry: z
    .date({
      message: "Expiration timestamp must be selected",
    })
    .refine(
      (value) => {
        return value > new Date();
      },
      {
        message: "Expiry must be a timestamp in the future",
      }
    ),

  no_expiry: z.boolean().default(false),

  lockup_time: z
    .object({
      duration: z.string().optional(),
      duration_type: z.enum(
        Object.keys(LockupTimeMap) as [keyof typeof LockupTimeMap]
      ),
    })
    .default({
      duration: "3",
      duration_type: "months",
    })
    .refine(
      (lockup_time) => {
        if (lockup_time.duration === undefined) {
          return false;
        } else {
          return true;
        }
      },
      {
        message: "Lockup time must be defined",
      }
    ),
});


export type MarketBuilderSteps = {
  [key: string]: {
    id: string;
    label: string;
    title: string;
    index: number;
  };
};

export const ActionTypeMap: Record<
  number,
  {
    index: number;
    id: string;
    label: string;
    tag: string;
    description: string;
    icon: LucideIcon;
  }
> = {
  0: {
    index: 1,
    id: "recipe",
    label: "Recipe Market",
    tag: "",
    description:
      'Offer incentives to perform any onchain transaction or series of transactions. Best for actions with lump sum rewards and timelocks."',
    icon: ScrollTextIcon,
  },
  1: {
    index: 2,
    id: "vault",
    label: "Vault Market",
    tag: "",
    description:
      "Offer incentives to deposit into an underlying ERC4626 Vault. Best for streaming rewards pro-rated to depositors and for actions easily represented by a 4646 vault.",
    icon: VaultIcon,
  },
};

export const RewardStyleMap: Record<
  number,
  {
    id: string;
    label: string;
    tag: string;
    description: string;
  }
> = {
  0: {
    id: "upfront",
    label: "Upfront",
    tag: "",
    description: "Pay all incentives at the completion of action.",
  },
  1: {
    id: "arrear",
    label: "Arrear",
    tag: "",
    description:
      "Lock Action Provider's assets and pay incentives once unlocked.",
  },
  2: {
    id: "forfeitable",
    label: "Forfeitable",
    tag: "",
    description:
      "Lock Action Provider's assets and stream incentives, which are forfeited if withdrawn early.",
  },
};

/**
 * @description Current Market Builder Steps
 */
export const MarketBuilderSteps: MarketBuilderSteps = {
  info: {
    id: "info",
    label: "Info",
    title: "Step 1: Create Market",
    index: 1,
  },
  actions: {
    id: "actions",
    label: "Actions",
    title: "Step 2.1: Incentive Actions",
    index: 2,
  },
  params: {
    id: "params",
    label: "Params",
    title: "Step 2.2: Action Params",
    index: 4,
  },
  vault: {
    id: "vault",
    label: "Vault",
    title: "Step 2: Configure 4626 Vault",
    index: 3,
  },
  review: {
    id: "review",
    label: "Review",
    title: "Step 3: Review",
    index: 5,
  },
  transaction: {
    id: "transaction",
    label: "Transaction",
    title: "Step 4: Transaction",
    index: 6,
  },
};

export const ActionsTypeMap: Record<
  ActionsType,
  { id: ActionsType; label: string }
> = {
  enter_actions: {
    id: "enter_actions",
    label: "Enter Market",
  },
  exit_actions: {
    id: "exit_actions",
    label: "Exit Market",
  },
};

export type ActionsType = "enter_actions" | "exit_actions";

export interface UseMarketBuilderManager {
  activeStep: string;
  setActiveStep: (activeStep: string) => void;

  lastActiveStep: string;
  setLastActiveStep: (lastActiveStep: string) => void;

  lastActiveSteps: string[];
  setLastActiveSteps: (lastActiveSteps: string[]) => void;

  forceClose: boolean;
  setForceClose: (forceClose: boolean) => void;

  actionsType: ActionsType;
  setActionsType: (actions_type: ActionsType) => void;

  draggingKey: string | null;
  setDraggingKey: (draggingKey: string | null) => void;

  reviewActionsType: ActionsType;
  setReviewActionsType: (reviewActionsType: ActionsType) => void;

  isMarketBuilderSubmitted: boolean;
  setIsMarketBuilderSubmitted: (isMarketBuilderSubmitted: boolean) => void;

  marketBuilderForm:
    | UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>
    | undefined;
  setMarketBuilderForm: (
    marketForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>
  ) => void;

  isContractAddressUpdated: boolean;
  setIsContractAddressUpdated: (contractAddressUpdated: boolean) => void;

  isContractAbiUpdated: boolean;
  setIsContractAbiUpdated: (contractAbiUpdated: boolean) => void;
}

export const useMarketBuilderManager = create<UseMarketBuilderManager>(
  (set) => ({
    // activeStep: MarketBuilderSteps.transaction.id,
    activeStep: MarketBuilderSteps.info.id, // default start step
    setActiveStep: (activeStep: string) => set({ activeStep }),

    lastActiveStep: "",
    setLastActiveStep: (lastActiveStep: string) => set({ lastActiveStep }),

    lastActiveSteps: ["", ""],
    setLastActiveSteps: (lastActiveSteps: string[]) => set({ lastActiveSteps }),

    forceClose: false,
    setForceClose: (forceClose: boolean) => set({ forceClose }),

    actionsType: "enter_actions",
    setActionsType: (actionsType: ActionsType) =>
      set({ actionsType: actionsType }),

    draggingKey: null,
    setDraggingKey: (draggingKey: string | null) => set({ draggingKey }),

    reviewActionsType: "enter_actions",
    setReviewActionsType: (reviewActionsType: ActionsType) =>
      set({ reviewActionsType }),

    isMarketBuilderSubmitted: false,
    setIsMarketBuilderSubmitted: (isMarketBuilderSubmitted: boolean) =>
      set({ isMarketBuilderSubmitted }),

    marketBuilderForm: undefined,
    setMarketBuilderForm: (
      marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>
    ) => set({ marketBuilderForm }),

    isContractAddressUpdated: false,
    setIsContractAddressUpdated: (isContractAddressUpdated: boolean) =>
      set({ isContractAddressUpdated }),

    isContractAbiUpdated: false,
    setIsContractAbiUpdated: (isContractAbiUpdated: boolean) =>
      set({ isContractAbiUpdated }),
  })
);

import type { SupportedChainName } from "../../types/base"
import type { ChainType } from "../../types/deposit"
import { assert } from "../../utils/assert"
import { assign, fromPromise, setup } from "xstate"

export type Context = {
  userAddress: string | null
  userChainType: ChainType | null
  blockchain: SupportedChainName | null
  preparationOutput:
    | {
        tag: "ok"
        value: {
          generateDepositAddress: string | null
        }
      }
    | {
        tag: "err"
        value: {
          reason: "ERR_GENERATING_ADDRESS"
        }
      }
    | null
}

export const depositGenerateAddressMachine = setup({
  types: {
    context: {} as Context,
    events: {} as {
      type: "REQUEST_GENERATE_ADDRESS"
      params: NonNullable<
        Pick<Context, "userAddress" | "userChainType" | "blockchain">
      >
    },
  },
  actors: {
    generateDepositAddress: fromPromise(
      async (_: {
        input: {
          userAddress: string
          userChainType: ChainType
          blockchain: SupportedChainName
        }
      }): Promise<string> => {
        throw new Error("not implemented")
      }
    ),
  },
  actions: {
    setInputParams: assign(({ event }) => {
      return {
        userAddress: event.params.userAddress,
        userChainType: event.params.userChainType,
        blockchain: event.params.blockchain,
      }
    }),
    resetPreparationOutput: assign(() => {
      return {
        preparationOutput: null,
      }
    }),
  },
  guards: {
    isInputSufficient: ({ event }) => {
      if (
        event.params.blockchain === "near" ||
        event.params.blockchain === "turbochain" ||
        event.params.blockchain === "aurora"
      ) {
        return false
      }
      return (
        event.params.userAddress != null &&
        event.params.userChainType != null &&
        event.params.blockchain != null
      )
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QTABwPawJYBcDiYAdmAE4CGOYAghBCXLALJkDGAFlsQMQBKAogEUAqnwDKAFQD6ePgDk+PKuL6SqAETX9RogNoAGALqJQGbDizpCxkAE9EAWgAcAdgB0AVgA0IAB6J3AJwAzK7O7s6OAIwATO4AvnHeKKa4BMTklDR0DMzsnGC8giIS0nIKSirqmmK6kUZIICnmltZ+CAHujqHRAQAsAY6OekHuI162iNF6ka4AbJFBjrNBzgHB0b1LCUlomKlEpBTUtPSwTKwcxK4w6RScUFwQlmCunABu6ADWL8l7+AcZY7ZM65S4vG6HcyEKAId7oFh3Sz6AzI6xNCxWBptWaOdweXo9fqLAl6Wa9bx2BDRVahIKLSIBVaBZx6UbbEC-MxpSFA07nPJXCEZe5cUgkdAkVyoAA2FAAZhKALauTn7W6ZE45C75a4Au7Q2GED4I5qEZGohrolpYxA42auaKRPQBaKOIKRdx6XoLCmIEZdT2BXruHGxWIBBKJECEdAoeANVX-dW8rUCsBov4Y1qIXqLVxBYIFxmdAkbX0IeyRZy9VxrNbOHEe93ORbsxPcwFZPmgnVC-VQDNmLM2hCzZzRVx6al05nOMKzALlxmTxnTAm9Ya9HHONu7Ll6jXA-lg1wsdCKmVgSgQQe4YegNrVrpkxwEhkBBfzcvuBauRyMqY5yCVkf0iXcmg7I4u1TE8sAgaV00tTNrQfHMlnzQt6xLaIywmKlYknIICSI5wPVmZYcMjOIgA */
  context: {
    userAddress: null,
    userChainType: null,
    blockchain: null,
    preparationOutput: null,
  },

  id: "depositGenerateAddressMachine",

  on: {
    REQUEST_GENERATE_ADDRESS: [
      {
        actions: ["resetPreparationOutput", "setInputParams"],
        target: ".generating",
        guard: "isInputSufficient",
      },
      ".completed",
    ],
  },

  states: {
    generating: {
      invoke: {
        input: ({ context }) => {
          assert(context.userAddress, "userAddress is null")
          assert(context.userChainType, "userChainType is null")
          assert(context.blockchain, "blockchain is null")
          return {
            userAddress: context.userAddress,
            userChainType: context.userChainType,
            blockchain: context.blockchain,
          }
        },
        onDone: {
          target: "completed",
          actions: assign({
            preparationOutput: ({ event }) => ({
              tag: "ok",
              value: {
                generateDepositAddress: event.output,
              },
            }),
          }),

          reenter: true,
        },
        onError: {
          target: "completed",
          actions: assign({
            preparationOutput: {
              tag: "err",
              value: {
                reason: "ERR_GENERATING_ADDRESS",
              },
            },
          }),

          reenter: true,
        },
        src: "generateDepositAddress",
      },
    },

    completed: {},
    idle: {},
  },

  initial: "idle",
})

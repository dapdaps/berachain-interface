// import { MINIMUM_BORROWING_MINT_RATE, SCALING_FACTOR, SCALING_FACTOR_BP } from "../constants";
// import {
//   DenAdjustmentParams,
//   DenClosure,
//   DenClosureParams,
//   DenCreation,
//   DenCreationParams,
//   DenAdjustment,
//   AllowedKey,
//   _CollateralChange,
//   _DebtChange,
//   DenChange,
//   UserDenStatus,
// } from "./types";
// import { assertCheck } from "../utils";

// const invalidDenCreation = (invalidDen: Den, error: DenCreationError): InvalidDenCreation => ({
//   type: "invalidCreation",
//   invalidDen,
//   error,
// });

// ⚠️ We got this source-code from Beraborrow official developers

//#region The above value is found in Beraborrow official dApp Sources
// the file such as https://app.beraborrow.com/assets/sdk-B5H5XQf9.js
export const MINIMUM_BORROWING_MINT_RATE = BigInt("5000000000000000");
// I think this is the token's decimals
export const SCALING_FACTOR = BigInt("1000000000000000000"); //1e18
export const SCALING_FACTOR_BP = BigInt("10000");
export enum UserDenStatus {
  nonExistent,
  active,
  closedByOwner,
  closedByLiquidation,
  closedByRedemption
}
export const DenStatusWithGoldsky: any = {
  [UserDenStatus.active]: "open",
};
//#endregion

const denCreation = <T>(params: any): any => ({
  type: "creation",
  params,
});

const denClosure = <T>(params: any): any => ({
  type: "closure",
  params,
});

const denAdjustment = <T>(params: any, setToZero?: "collateral" | "debt"): any => ({
  type: "adjustment",
  params,
  setToZero,
});

const valueIsDefined = <T>(entry: [string, T | undefined]): entry is [string, T] => entry[1] !== undefined;

const allowedDenCreationKeys: any = ["depositCollateral", "borrowNECT"];

function checkAllowedDenCreationKeys<T>(entries: [string, T][]): any {
  const badKeys = entries.filter(([k]) => !(allowedDenCreationKeys as string[]).includes(k)).map(([k]) => `'${k}'`);

  if (badKeys.length > 0) {
    throw new Error(`DenCreationParams: property ${badKeys.join(", ")} not allowed`);
  }
}

const denCreationParamsFromEntries = <T>(entries: any): any => {
  const params = Object.fromEntries(entries) as any;
  const missingKeys = allowedDenCreationKeys.filter((k: any) => !(k in params)).map((k: any) => `'${k}'`);

  if (missingKeys.length > 0) {
    throw new Error(`DenCreationParams: property ${missingKeys.join(", ")} missing`);
  }

  return params;
};

const nonZero = <T>([, v]: [T, bigint]): boolean => !(v === BigInt(0));

export const _normalizeDenCreation = (params: Record<string, bigint | undefined>): any => {
  const definedEntries = Object.entries(params).filter(valueIsDefined);
  checkAllowedDenCreationKeys(definedEntries);
  const nonZeroEntries = definedEntries;

  return denCreationParamsFromEntries(nonZeroEntries);
};

const allowedDenAdjustmentKeys: any = ["depositCollateral", "withdrawCollateral", "borrowNECT", "repayNECT"];

function checkAllowedDenAdjustmentKeys<T>(entries: [string, T][]): any {
  const badKeys = entries.filter(([k]) => !(allowedDenAdjustmentKeys as string[]).includes(k)).map(([k]) => `'${k}'`);

  if (badKeys.length > 0) {
    throw new Error(`DenAdjustmentParams: property ${badKeys.join(", ")} not allowed`);
  }
}

const collateralChangeFrom = <T>({ depositCollateral, withdrawCollateral }: any): any=> {
  if (depositCollateral !== undefined && withdrawCollateral !== undefined) {
    throw new Error("DenAdjustmentParams: 'depositCollateral' and 'withdrawCollateral' " + "can't be present at the same time");
  }

  if (depositCollateral !== undefined) {
    return { depositCollateral };
  }

  if (withdrawCollateral !== undefined) {
    return { withdrawCollateral };
  }
};

const debtChangeFrom = <T>({ borrowNECT, repayNECT }: any): any => {
  if (borrowNECT !== undefined && repayNECT !== undefined) {
    throw new Error("DenAdjustmentParams: 'borrowNECT' and 'repayNECT' can't be present at the same time");
  }

  if (borrowNECT !== undefined) {
    return { borrowNECT };
  }

  if (repayNECT !== undefined) {
    return { repayNECT };
  }
};

const denAdjustmentParamsFromEntries = <T>(entries: any): any => {
  const params = Object.fromEntries(entries) as any;

  const collateralChange = collateralChangeFrom(params);
  const debtChange = debtChangeFrom(params);

  if (collateralChange !== undefined && debtChange !== undefined) {
    return { ...collateralChange, ...debtChange };
  }
  if (collateralChange !== undefined) {
    return collateralChange;
  }

  if (debtChange !== undefined) {
    return debtChange;
  }

  throw new Error("DenAdjustmentParams: must include at least one non-zero parameter");
};

export const _normalizeDenAdjustment = (params: Record<string, bigint | undefined>): any => {
  const definedEntries = Object.entries(params).filter(valueIsDefined);
  checkAllowedDenAdjustmentKeys(definedEntries);
  const nonZeroEntries = definedEntries.filter(nonZero);
  return denAdjustmentParamsFromEntries(nonZeroEntries);
};

const applyFee = (borrowingRate: bigint, debtIncrease: bigint) => debtIncrease + (debtIncrease * borrowingRate) / SCALING_FACTOR;

const unapplyFee = (borrowingRate: bigint, newDebt: bigint): bigint => (newDebt * SCALING_FACTOR) / SCALING_FACTOR + borrowingRate;

/**
 * A combination of collateral and debt.
 *
 * @public
 */
export class Den {
  /** Amount of native currency (e.g. iBGT) collateralized. */
  readonly collateral: bigint;

  /** Amount of Debt owed. */
  readonly debt: bigint;

  constructor(collateral = BigInt(0), debt = BigInt(0)) {
    this.collateral = collateral;
    this.debt = debt;
  }

  get isEmpty(): boolean {
    return this.collateral === BigInt(0) && this.debt === BigInt(0);
  }

  /**
   * Amount of Debt that must be repaid to close this Den.
   *
   * @remarks
   * This doesn't include the liquidation reserve, which is refunded in case of normal closure.
   */
  netDebt = (NECT_LIQUIDATION_RESERVE: bigint): bigint => {
    if (this.debt < NECT_LIQUIDATION_RESERVE) {
      return BigInt(0);
    }

    return this.debt - NECT_LIQUIDATION_RESERVE;
  };

  get _nominalCollateralRatio(): bigint {
    const NICR_PRECISION = BigInt("100000000000000000000"); //1e20;
    if (this.debt === BigInt(0)) return BigInt(0);
    return (this.collateral * NICR_PRECISION) / this.debt;
  }

  /** Calculate the Den's collateralization ratio at a given price. */
  collateralRatio(price: bigint, shareRatio = SCALING_FACTOR): bigint {
    if (this.collateral === BigInt(0)) return BigInt(0);
    if (this.debt === BigInt(0)) return BigInt(0);
    return (this.getCollateralShares(shareRatio) * price) / this.debt;
  }

  /** Calculate the Den's LTV at a given price. */
  ltv(price: bigint, shareRatio = SCALING_FACTOR): bigint {
    if (this.collateral === BigInt(0)) return BigInt(0);
    if (this.debt === BigInt(0)) return BigInt(0);
    if (price === BigInt(0)) return BigInt(0);
    if (shareRatio === BigInt(0)) return BigInt(0);
    const collateralValue = (this.getCollateralShares(shareRatio) * price) / SCALING_FACTOR;
    return (this.debt * SCALING_FACTOR) / collateralValue;
  }
  /**
   * Whether the Den is undercollateralized at a given price.
   *
   * @returns
   * `true` if the Den's collateralization ratio is less than the
   */
  collateralRatioIsBelowMinimum(price: bigint, mcr: bigint, shareRatio = SCALING_FACTOR): boolean {
    return this.collateralRatio(price, shareRatio) <= mcr;
  }

  /**
   * Whether the collateralization ratio is less than the  CRITICAL COLLATERAL RATIO at a
   * given price.
   *
   */
  collateralRatioIsBelowCritical(price: bigint, criticalCollateralRatio: bigint, shareRatio = SCALING_FACTOR): boolean {
    return this.collateralRatio(price, shareRatio) < criticalCollateralRatio;
  }

  toString(): string {
    return `{ collateral: ${this.collateral}, debt: ${this.debt} }`;
  }

  equals(that: Den): boolean {
    return this.collateral === that.collateral && this.debt === that.debt;
  }

  add(that: Den): Den {
    return new Den(this.collateral + that.collateral, this.debt + that.debt);
  }

  addCollateral(collateral: bigint): Den {
    return new Den(this.collateral + collateral, this.debt);
  }

  addDebt(debt: bigint): Den {
    return new Den(this.collateral, this.debt + debt);
  }

  subtract(that: Den): Den {
    const { collateral, debt } = that;

    return new Den(this.collateral > collateral ? this.collateral - collateral : BigInt(0), this.debt > debt ? this.debt - debt : BigInt(0));
  }

  subtractCollateral(collateral: bigint): Den {
    return new Den(this.collateral > collateral ? this.collateral - collateral : BigInt(0), this.debt);
  }

  subtractDebt(debt: bigint): Den {
    return new Den(this.collateral, this.debt > debt ? this.debt - debt : BigInt(0));
  }

  multiply(multiplier: bigint): Den {
    return new Den(this.collateral * multiplier, this.debt * multiplier);
  }

  setCollateral(collateral: bigint): Den {
    return new Den(collateral, this.debt);
  }

  setDebt(debt: bigint): Den {
    return new Den(this.collateral, debt);
  }
  getCollateralShares(shareRatio = SCALING_FACTOR, collateral?: bigint) {
    collateral ??= this.collateral;
    return (collateral * shareRatio) / SCALING_FACTOR;
  }
  convertCollateralToCollateralShares(shareRatio = SCALING_FACTOR) {
    return new Den((this.collateral * shareRatio) / SCALING_FACTOR, this.debt);
  }
  calculateDebt(collateral: bigint, collateralPrice: bigint, shareRatio = SCALING_FACTOR, collateralRatio?: bigint, getFees?: (debt: bigint) => bigint): bigint {
    if (collateral === BigInt(0)) return BigInt(0);
    if (collateralPrice === BigInt(0)) return BigInt(0);
    if (collateralRatio === BigInt(0)) return BigInt(0);
    const collateralValue = (collateral * collateralPrice) / SCALING_FACTOR;
    const debt = (collateralValue * collateralRatio!) / SCALING_FACTOR;
    return getFees ? getFees(debt) : debt;
  }

  calculateCollateral(debt: bigint, collateralPrice: bigint, shareRatio = SCALING_FACTOR, collateralRatio?: bigint): bigint {
    if (debt === BigInt(0)) return BigInt(0);
    if (collateralPrice === BigInt(0)) return BigInt(0);
    if (collateralRatio === BigInt(0)) return BigInt(0);
    const collateralValue = (debt * SCALING_FACTOR) / collateralRatio!;
    return (collateralValue * SCALING_FACTOR) / collateralPrice;
  }

  calculateLiquidationPrice(mcr: bigint): bigint {
    if (this.collateral === BigInt(0)) return BigInt(0);
    if (this.debt === BigInt(0)) return BigInt(0);
    return (this.debt * mcr) / this.collateral;
  }

  getAdjustVariables(targetDen: Den): any {
    return {
      depositCollateral: this.collateral < targetDen.collateral ? targetDen.collateral - this.collateral : undefined,
      withdrawCollateral: this.collateral > targetDen.collateral ? this.collateral - targetDen.collateral : undefined,
      repayNECT: this.debt > targetDen.debt ? this.debt - targetDen.debt : undefined,
      borrowNECT: this.debt < targetDen.debt ? targetDen.debt - this.debt : undefined,
    } as any;
  }
  getDepositVariables(): any {
    return {
      depositCollateral: this.collateral,
      borrowNECT: this.debt,
    };
  }
  getWithdrawVariables(liquidationReserve: bigint): any {
    return this.netDebt(liquidationReserve) !== BigInt(0) ? { withdrawCollateral: this.collateral, repayNECT: this.netDebt(liquidationReserve) } : { withdrawCollateral: this.collateral }
  }

  calculateMaxLeverage(marginInShares: bigint, price: bigint, minimumCR: bigint, currentColl?: bigint, currentDebt?: bigint): bigint {
    const totalColl = (currentColl ?? BigInt(0)) + marginInShares;
    if (totalColl === BigInt(0)) {
      return BigInt(0);
    }

    const baseCollValue = (totalColl * price) / SCALING_FACTOR;
    if (baseCollValue <= (minimumCR * currentDebt!) / SCALING_FACTOR) return BigInt(0);

    const maxDebt = (baseCollValue * SCALING_FACTOR) / minimumCR;
    const maxLeverage = (maxDebt * SCALING_FACTOR) / marginInShares;
    return maxLeverage;
  }

  calculateLeveragedDebt(marginInShares: bigint, leverageBP: bigint, collateralPrice: bigint, debtPrice: bigint, currentColl?: bigint): bigint {
    const additionalCollateral = marginInShares;
    if (additionalCollateral === BigInt(0)) throw new Error("Zero collateral");

    const collateralValue = (additionalCollateral * collateralPrice) / SCALING_FACTOR;
    const maxDebt = (collateralValue * leverageBP) / SCALING_FACTOR_BP;
    return (maxDebt * SCALING_FACTOR) / debtPrice;
  }

  private _debtChange({ debt }: Den, borrowingRate: bigint): any {
    return debt > this.debt ? { borrowNECT: unapplyFee(borrowingRate, debt - this.debt) } : { repayNECT: this.debt - debt };
  }

  private _collateralChange({ collateral }: Den): any {
    return collateral > this.collateral ? { depositCollateral: collateral - this.collateral } : { withdrawCollateral: this.collateral - collateral };
  }

  /**
   * Calculate the difference between this Den and another.
   *
   * @param that - The other Den.
   * @param borrowingRate - Borrowing rate to use when calculating a borrowed amount.
   * @param liquidationReserve - amount Reserved for liquidation
   *
   * @returns
   * An object representing the change, or `undefined` if the Dens are equal.
   */
  whatChanged(that: Den, liquidationReserve: bigint, borrowingRate: bigint = MINIMUM_BORROWING_MINT_RATE): any {
    if (this.collateral !== that.collateral) {
      return denAdjustment<bigint>(this._debtChange(that, borrowingRate), that.debt === BigInt(0) ? "debt" : undefined)
    }
    if (this.debt !== that.debt) {
      return denAdjustment<bigint>(this._collateralChange(that), that.collateral === BigInt(0) ? "collateral" : undefined)
    }
    return denAdjustment<bigint>(this._collateralChange(that), 
      (that.debt === BigInt(0) ? "debt" : undefined) ?? (that.collateral === BigInt(0) ? "collateral" : undefined)
    );
  }

  /**
   * Make a new Den by applying a {@link DenChange} to this Den.
   *
   * @param change - The change to apply.
   * @param borrowingRate - Borrowing rate to use when adding a borrowed amount to the Den's debt.
   */
  apply(change: any, borrowingRate: bigint = MINIMUM_BORROWING_MINT_RATE, liquidationReserve?: bigint): any {
    if (!change) {
      return this;
    }

    switch (change.type) {
      case "invalidCreation":
        if (!this.isEmpty) {
          throw new Error("Can't create onto existing Den");
        }

        return change.invalidDen;

      case "creation": {
        if (!this.isEmpty) {
          throw new Error("Can't create onto existing Den");
        }
        if (liquidationReserve === undefined) {
          throw new Error("Can't create  Den without Liquidation reserve");
        }
        const { depositCollateral, borrowNECT } = change.params;

        return new Den(depositCollateral, liquidationReserve + applyFee(borrowingRate, borrowNECT));
      }

      case "closure":
        if (this.isEmpty) {
          throw new Error("Can't close empty Den");
        }

        return _emptyDen;

      case "adjustment": {
        const {
          setToZero,
          params: { depositCollateral, withdrawCollateral, borrowNECT, repayNECT },
        } = change;

        const collateralDecrease = withdrawCollateral ?? BigInt(0);
        const collateralIncrease = depositCollateral ?? BigInt(0);
        const debtDecrease = repayNECT ?? BigInt(0);
        const debtIncrease = borrowNECT ? applyFee(borrowingRate, borrowNECT) : BigInt(0);

        const newDen = change.setToZero === "collateral"
          ? this.setCollateral(BigInt(0)).addDebt(debtIncrease).subtractDebt(debtDecrease)
          : change.setToZero === "debt"
            ? this.setDebt(BigInt(0)).addCollateral(collateralIncrease).subtractCollateral(collateralDecrease)
            : this.addCollateral(collateralIncrease).subtractCollateral(collateralDecrease).addDebt(debtIncrease).subtractDebt(debtDecrease);

        return liquidationReserve !== undefined ? newDen : newDen;
      }
    }
  }

  /**
   * Calculate the result of an  openDen transaction.
   *
   * @param params - Parameters of the transaction.
   * @param borrowingRate - Borrowing rate to use when calculating the Den's debt.
   */
  static create(params: any, liquidationReserve: bigint, borrowingRate?: bigint): any {
    return _emptyDen.apply(denCreation(_normalizeDenCreation(params)), borrowingRate, liquidationReserve);
  }

  /**
   * Calculate the parameters of an  openDen transaction
   * that will result in the given Den.
   *
   * @param that - The Den to recreate.
   * @param borrowingRate - Current borrowing rate.
   * @param liquidationReserve - amount Reserved for liquidation
   */
  static recreate(that: any, liquidationReserve: bigint, borrowingRate?: bigint): any {
    const change = _emptyDen.whatChanged(that, liquidationReserve, borrowingRate);
    // assertCheck(change?.type === "creation", "change must be of creation");
    return change?.type === "creation" ? change.params : undefined;
  }

  /**
   * Calculate the result of an  adjustDen transaction
   * on this Den.
   *
   * @param params - Parameters of the transaction.
   * @param borrowingRate - Borrowing rate to use when adding to the Den's debt.
   */
  adjust(params: any, borrowingRate?: bigint): any {
    return this.apply(denAdjustment(_normalizeDenAdjustment(params)), borrowingRate);
  }

  /**
   * Calculate the parameters of an  adjustDen
   * transaction that will change this Den into the given Den.
   *
   * @param that - The desired result of the transaction.
   * @param borrowingRate - Current borrowing rate.
   * @param liquidationReserve - amount Reserved for liquidation
   */
  adjustTo(that: any, liquidationReserve: bigint, borrowingRate?: bigint): any {
    const change = this.whatChanged(that, liquidationReserve, borrowingRate);
    // assertCheck(change?.type === "adjustment", "change must be of type Adjustment");
    return change?.type === "adjustment" ? change.params : undefined;
  }

  getEffectiveApys(params: { leverage?: bigint; collApy: bigint; debtInterest: bigint; collVaultPrice: bigint; collShareAmount?: bigint; debtAmount?: bigint }) {
    const { collApy, collShareAmount, collVaultPrice, debtAmount, debtInterest, leverage = SCALING_FACTOR_BP } = params;
    const collateral = collShareAmount ?? this.collateral;
    const debt = debtAmount ?? this.debt;
    // const _effectiveDebtInterestRate = (debtInterest * this.exposureRatio(collateral, collVaultPrice, debt, SCALING_FACTOR)) / SCALING_FACTOR;
    // const effectiveDebtInterestRate = ((_effectiveDebtInterestRate > debtInterest ? debtInterest : _effectiveDebtInterestRate) * leverage) / SCALING_FACTOR_BP;
    const effectiveDebtInterestRate = (debtInterest * leverage) / SCALING_FACTOR_BP;
    const leverageCollApy = (collApy * leverage) / SCALING_FACTOR_BP;
    const apy = leverageCollApy - effectiveDebtInterestRate;
    return { apy, leverageCollApy, effectiveDebtInterestRate };
  }
}

export const _emptyDen = new Den();

/**
 * Represents whether a UserDen is open or not, or why it was closed.
 *
 * @public
 */

/**
 * A Den that is associated with a single owner.
 *
 * @remarks
 * The SDK uses the base Den class as a generic container of collateral and debt, for
 * example to represent the total collateral and debt locked up
 * in the protocol.
 *
 * The `UserDen` class extends `Den` with extra information that's only available for Dens
 * that are associated with a single owner (such as the owner's address, or the Den's status).
 *
 * @public
 */
export class UserDen extends Den {
  /** Address that owns this Den. */
  readonly ownerAddress: `0x${string}`;

  /** Provides more information when the UserDen is empty. */
  readonly status: any;

  constructor(ownerAddress: `0x${string}`, status: any, collateral?: bigint, debt?: bigint) {
    super(collateral, debt);

    this.ownerAddress = ownerAddress;
    this.status = status;
  }

  equals(that: UserDen): boolean {
    return super.equals(that) && this.ownerAddress === that.ownerAddress && this.status === that.status;
  }

  toString(): string {
    return `{ ownerAddress: "${this.ownerAddress}"` + `, collateral: ${this.collateral}` + `, debt: ${this.debt}` + `, status: "${this.status}" }`;
  }
}

/**
 * A Den in its state after the last direct modification.
 *
 * @remarks
 * The Den may have received collateral and debt shares from liquidations since then.
 * Use applyRedistribution() to
 * calculate the Den's most up-to-date state.
 *
 * @public
 */
export class DenWithPendingRedistribution extends UserDen {
  private readonly stake: bigint;
  private readonly snapshotOfTotalRedistributed: Den;

  constructor(ownerAddress: `0x${string}`, status: any, collateral?: bigint, debt?: bigint, stake = BigInt(0), snapshotOfTotalRedistributed = _emptyDen) {
    super(ownerAddress, status, collateral, debt);
    this.stake = stake;
    this.snapshotOfTotalRedistributed = snapshotOfTotalRedistributed;
  }

  applyRedistribution(totalRedistributed: Den): UserDen {
    const afterRedistribution = this.add(totalRedistributed.subtract(this.snapshotOfTotalRedistributed).multiply(this.stake));

    return new UserDen(this.ownerAddress, this.status, afterRedistribution.collateral, afterRedistribution.debt);
  }

  equals(that: DenWithPendingRedistribution): boolean {
    return super.equals(that) && this.stake === that.stake && this.snapshotOfTotalRedistributed.equals(that.snapshotOfTotalRedistributed);
  }
}

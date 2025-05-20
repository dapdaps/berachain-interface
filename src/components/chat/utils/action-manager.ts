import useSwapStore from "../stores/useSwapStores";

export type ActionHandler = (params?: any) => void;

const actionHandlers: Record<string, ActionHandler> = {};

export function registerActionHandler(actionType: string, handler: ActionHandler) {
  actionHandlers[actionType] = handler;
}

// 执行动作
export function executeAction(actionType: string, params?: any) {
  console.log(`Executing action: ${actionType}`, params);
  const handler = actionHandlers[actionType];
  if (handler) {
    handler(params);
  } else {
    console.warn(`No handler registered for action type: ${actionType}`);
  }
}

export function initializeActionHandlers() {
  console.log("Initializing action handlers");
  
  registerActionHandler("swap", (params) => {
    console.log("Executing swap action", params);
    
    const swapStore = useSwapStore.getState();
    if (params?.inputCurrency) {
      swapStore.setDefaultInputCurrency(params.inputCurrency);
    }
    swapStore.openSwapModal();
  });
  
}

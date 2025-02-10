import { uuid } from './index'

const ROUTER_CENTER: any = {}

export function setQuote(currentRoute: any): string {
    const _uuid = uuid()
    ROUTER_CENTER[_uuid] = currentRoute
    return _uuid
}

export function getQuoteInfo(uuid: string) {
    return ROUTER_CENTER[uuid]
}
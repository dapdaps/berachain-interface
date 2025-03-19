
import { ethers, Contract, Signer } from 'ethers'
import Big from 'big.js'
import { approve } from './util/approve'
import { getIcon, getAllToken, getChainScan, getBridgeMsg } from './util/index'
import { getQuoteInfo, setQuote } from './util/routerController'
import { getQuote as getStargateRoute, execute as executeStargate, getStatus as getStargateStatus } from './bridges/stargate'
import { getQuote as getJumperRoute, execute as executeJumper, getStatus as getJumperStatus } from './bridges/jumper'

import { ExecuteRequest, QuoteRequest, QuoteResponse, StatusParams, StatusRes } from './type'

const executeTypes: any = {
  executeStargate,
  executeJumper,
}


export async function execute(executeRequest: ExecuteRequest, signer: Signer) {
  const quoteInfo = getQuoteInfo(executeRequest.uuid)
  const executeFn = executeTypes[`execute${quoteInfo.bridgeType}`]

  if (executeFn) {
    try {
      return executeFn(executeRequest, signer)
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  throw new Error('Missing Route')
}

export async function getQuote(quoteRequest: QuoteRequest, signer: Signer, callback?: (quoteResponse: QuoteResponse) => void) {
  const quoteP = []
  const { engine } = quoteRequest

  function emitRes(val: QuoteResponse | QuoteResponse[] | null) {
    if (val) {
      if (Array.isArray(val)) {
        val.forEach(item => {
          callback && callback(item)
        })
      } else {
        callback && callback(val)
      }
    }
    return val
  }

  let needFilter = false

  if (engine && engine.length) {
    for (let i = 0; i < engine.length; i++) {
      const key = engine[i]
      switch (key) {
        case 'stargate':
          quoteP.push(getStargateRoute(quoteRequest, signer).then(emitRes).catch(e => console.log('stargate:', e)))
          break;
        case 'jumper':
          quoteP.push(getJumperRoute(quoteRequest, signer).then(emitRes).catch(e => console.log('jumper:', e)))
          break;
      }
    }
  } else {
    const stargateRoute = getStargateRoute(quoteRequest, signer).then(emitRes).catch(e => console.log('stargate:', e))
    quoteP.push(stargateRoute)
  }

  const resList: (QuoteResponse | QuoteResponse[] | null | void)[] = await Promise.all(quoteP)

  console.log('resList: ', resList)

  const _resList: QuoteResponse[] = []
  resList.forEach((item: any) => {
    if (!item) {
      return
    }
    if (Array.isArray(item)) {
      _resList.push(...item)
      return
    }

    _resList.push(item)
  })

  
  return _resList
}

export async function preloadResource(engine?: string) {
  if (!engine) {
    // import('./bridges/axelar/index')
  }
}

export async function getStatus(params: StatusParams, engine: string, signer: Signer): Promise<boolean | undefined | null | StatusRes> {
  const _engine = engine.toLocaleLowerCase()
  if (_engine === 'stargate') {
    return getStargateStatus(params)
  }
  if (_engine === 'jumper') {
    return getJumperStatus(params)
  }
}

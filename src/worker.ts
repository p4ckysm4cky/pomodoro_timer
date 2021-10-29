const myObj: any = this // strat to ignore typescript
onmessage = e => {
    setInterval(() => {
        myObj.postMessage(' ')
    }, 1000)
}
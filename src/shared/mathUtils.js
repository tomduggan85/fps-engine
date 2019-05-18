export const mapToRange = ( v, inRange, outRange ) => {

  const [ inLow, inHigh ] = inRange
  const pct = Math.max(0, Math.min(( v - inLow ) / ( inHigh - inLow ), 1))

  //console.error(v + ' is ' + pct + ' between ' + inRange)

  const [ outLow, outHigh ] = outRange
  //console.error(outLow + ' + ' + pct + ' * (' + outHigh + ' - ' + outLow + ')')
  return outLow + pct * ( outHigh - outLow )
}
export const mapToRange = ( v, inRange, outRange ) => {

  const [ inLow, inHigh ] = inRange
  const pct = Math.max(0, Math.min(( v - inLow ) / ( inHigh - inLow ), 1))

  const [ outLow, outHigh ] = outRange
  return outLow + pct * ( outHigh - outLow )
}
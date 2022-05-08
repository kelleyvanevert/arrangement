export function mapAccum<M, X, Y>({
  arr,
  initial,
  map,
}: {
  arr: X[];
  initial: M;
  map: (m: M, x: X) => [M, Y];
}): Y[] {
  let curr = initial;
  return arr.map((x) => {
    const [next, y] = map(curr, x);
    curr = next;
    return y;
  });
}

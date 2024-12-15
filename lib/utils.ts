
// -------- ADD COMMAS TO BALANCE --------
export function addCommas(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
import { formatCurrency } from "../scripts/utils/money";

console.log('Test Suit:formatCurrency');

console.log('converts cent into dollars')
if(formatCurrency(2025)='20.25'){
  console.log("passed")
}
else{
  console.log("failed")
}

console.log('work with zero');
if(formatCurrency(0)='0.00'){
  console.log("passed")
}
else{
  console.log("failed")
}

console.log('rounds up to the nearest cent');
if(formatCurrency(2000.5)='20.01'){
  console.log("passed")
}
else{
  console.log("failed")
}
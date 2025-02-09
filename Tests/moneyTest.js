import { formatCurrency } from "../scripts/utils/money";

if(formatCurrency(2025)='20.25'){
  console.log("passed")
}
else{
  console.log("failed")
}
if(formatCurrency(0)='0.00'){
  console.log("passed")
}
else{
  console.log("failed")
}
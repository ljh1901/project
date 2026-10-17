
function selectCheckBox(){
    
const checkBoxStatus=document.getElementById('checkAll').checked;
const checkId = document.querySelectorAll('.checkBoxId');
   for(const check of checkId)
    
    if(checkBoxStatus){
        check.checked = true;
    }else{
        check.checked = false;
    }
}
function selectedCheckBoxes(){
    
}
export {selectCheckBox, selectedCheckBoxes};
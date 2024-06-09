let addbtn=document.querySelector(".add-tick");
let modalcont=document.querySelector(".modal-cont");
let textArea=document.querySelector("textarea");
let mainArea=document.querySelector(".main-cont");
let removeBtn=document.querySelector(".remove-tick");
let diff_color=document.querySelectorAll(".color");

let addFlag=false;
let removeFlag=false;

let colors=["lightpink","lightblue","lightgreen","black"];
let allTickets=[];

// if localstorage have tickets then retrieve it and display it
if(localStorage.getItem("Jira_Tickets")){
    allTickets=JSON.parse(localStorage.getItem("Jira_Tickets"));

    
    allTickets.forEach((ticketobj)=>{
        createTask(ticketobj.value,ticketobj.ticketid,ticketobj.ticketcolor,false);
    })
}

//setting the priority color on new modal
let allColor=document.querySelectorAll(".task-color");
let curcolor="black";

allColor.forEach((colorelem)=>{
    colorelem.addEventListener("click",(e)=>{
        allColor.forEach((clr)=>{
            clr.classList.remove("border");
        })
        colorelem.classList.add("border");
        curcolor=colorelem.classList[0];
    })
})



//displaying only filtered colors;
for(let i=0;i<diff_color.length;i++){
    diff_color[i].addEventListener("click",(e)=>{
        let mycolor=diff_color[i].classList[0];

        let filteredArr=allTickets.filter((ticketobj,idx)=>{
            return ticketobj.ticketcolor==mycolor;
        })

        //removing all tickets first;
        let allticketcont=document.querySelectorAll(".ticket-cont");
        for(let j=0;j<allticketcont.length;j++){
            allticketcont[j].remove();
        }

        //showing all filered ticke
        for(let j=0;j<filteredArr.length;j++){
            createTask(filteredArr[j].value,filteredArr[j].ticketid,filteredArr[j].ticketcolor,false)
        }
    })

    diff_color[i].addEventListener("dblclick",(e)=>{
        //removing all tickets first;
        let allticketcont=document.querySelectorAll(".ticket-cont");
        for(let j=0;j<allticketcont.length;j++){
            allticketcont[j].remove();
        }

        //showing all filered ticke
        for(let j=0;j<allTickets.length;j++){
            createTask(allTickets[j].value,allTickets[j].ticketid,allTickets[j].ticketcolor,false);
        }

    })
}

//displaying modal on click or hiding it
addbtn.addEventListener("click",(e)=>{
    addFlag=!addFlag;

    //addFlag=true,-> display modal
    // else hide modal
    if(addFlag){
        modalcont.style.display="flex";
    }
    else{
        modalcont.style.display="none";
        textArea.value="";
    }
})

//toggling removeFlag when clicked on remove btn
removeBtn.addEventListener("click",(e)=>{
    removeFlag=!removeFlag;
})

//for adding task
modalcont.addEventListener("keydown",(e)=>{
    let val=e.key;
    if(val==="Shift"){

        createTask(textArea.value,"#"+shortid(),curcolor,true);
        addFlag=!addFlag;
        defaultModal();
    }
})
function createTask(value,ticketid,ticketcolor,flag){
    let ticketcont=document.createElement("div");
    ticketcont.setAttribute("class","ticket-cont");
    ticketcont.innerHTML=`
        <div class="ticket-color ${ticketcolor} "></div>
        <div class="ticket-id">#${ticketid}</div>
        <div class="ticket-task" spellcheck="false">${value}</div>
        <div class="ticket-lock">
                    <i class="fa-solid fa-lock"></i>
        </div>
    `;

    mainArea.appendChild(ticketcont);
    if(flag){
        allTickets.push({value,ticketid,ticketcolor});
        localStorage.setItem("Jira_Tickets",JSON.stringify(allTickets));
    }


    handleRemoval(ticketcont,ticketid);
    handleLock(ticketcont,ticketid);
    handleColorChange(ticketcont,ticketid);
}

//remove ticket from main cont
function handleRemoval(ticketcont,id){

    ticketcont.addEventListener("click",(e)=>{
        
        
        let tid_idx=getTicketIdx(id);
        
        if(removeFlag) {
            ticketcont.remove();

            allTickets.splice(tid_idx,1);
            localStorage.setItem("Jira_Tickets",JSON.stringify(allTickets));
        }
    })
}
//get idx of ticketcont from alltickets
function getTicketIdx(id){
    let idx=allTickets.findIndex((ticketobj)=>{
        return ticketobj.ticketid==id;
    })
    return idx;
}

// handle lock icon and give access to edit the task area
function handleLock(ticketcont,id){
    let ticketlock=ticketcont.querySelector(".ticket-lock");
    let lockElem=ticketlock.children[0];
    let taskA=ticketcont.querySelector(".ticket-task");
    lockElem.addEventListener("click",(e)=>{
        if(lockElem.classList.contains("fa-lock")){
            lockElem.classList.remove("fa-lock");
            lockElem.classList.add("fa-lock-open");
            taskA.setAttribute("contenteditable",true);
        }
        else{
            lockElem.classList.remove("fa-lock-open");
            lockElem.classList.add("fa-lock");
            taskA.setAttribute("contenteditable",false);
        }

        let idx=getTicketIdx(id);
        allTickets[idx].value=taskA.innerText;
        localStorage.setItem("Jira_Tickets",JSON.stringify(allTickets));
    })
}

function handleColorChange(ticketcont,id){
    let ticketColor=ticketcont.querySelector(".ticket-color");
    ticketColor.addEventListener("click",(e)=>{
        let currentTicketColor=ticketColor.classList[1];
        
        let currentTicketColoridx=colors.findIndex((color)=>{
            return  color==currentTicketColor;
        })

        let newidx=(currentTicketColoridx+1)%colors.length;
        let newticketColor=colors[newidx];

        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newticketColor);

        let idx=getTicketIdx(id);
        allTickets[idx].ticketcolor=newticketColor;
        localStorage.setItem("Jira_Tickets",JSON.stringify(allTickets));
    })
}
function defaultModal(){
    modalcont.style.display="none";
    textArea.value="";
    allColor.forEach((clr)=>{
        clr.classList.remove("border");
    })
    allColor[allColor.length-1].classList.add("border");
}


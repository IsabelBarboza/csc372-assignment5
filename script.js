const gallery=document.getElementById("gallery");
const button=document.getElementById("searchBtn");

const apiBase="https://api.github.com/users/";

button.addEventListener("click",() =>{
    const username =document.getElementById("username").value.trim();
    
    if(username !==""){
        getRepos(username);    /*fetch and show repos*/
    }
});

window.onload=()=>{          /*loading default repos*/
    getRepos("IsabelBarboza");
};

async function getRepos(username) {     /*function to fetch a repo*/
    try{
        let res=await fetch(apiBase+username+"/repos");
        if(!res.ok){
            throw new Error("Network response was not ok");
        }
        let repoData=await res.json();
        gallery.textContent="";

        if (repoData.length===0){
            gallery.textContent="No repositories";
            return;
        }
        let repos=repoData.slice(0,10);   /*limit to 10 repos*/
        for(let repo of repos){
            await createCard(repo);
        }
    }catch(err){    /*handling error*/
        console.error("Error:",err);
        gallery.textContent="Error loading data";
    }
}

async function createCard(repo){
    const card=document.createElement("div");
    card.classList.add("card");

    const icon=document.createElement("i");  /*github icon*/
    icon.classList.add("fa-brands","fa-github");

    const name=document.createElement("a");
    name.textContent=repo.name;
    name.href=repo.html_url;
    name.target="_blank";

    const desc=document.createElement("p");    /*repo description*/
    desc.textContent=repo.description || "No description";


    const created=document.createElement("p");
    const createdDate=new Date(repo.created_at).toLocaleDateString("en-US");   /*format the date*/
    created.textContent="Created: "+createdDate;

    const updated=document.createElement("p");  
    const updatedDate=new Date(repo.updated_at).toLocaleDateString("en-US");
    updated.textContent="Updated:" +updatedDate;

    const watchers=document.createElement("p");
    watchers.textContent="Watchers: "+repo.watchers_count;

    let langRes=await fetch(repo.languages_url); /*fetch repo languages*/
    let langData=await langRes.json();

    const langs=document.createElement("p");
    langs.textContent="Languages: "+Object.keys(langData).join(", ");

    card.appendChild(icon);  /*append elements to the card*/
    card.appendChild(name);
    card.appendChild(desc);
    card.appendChild(created);
    card.appendChild(updated);
    card.appendChild(watchers);
    card.appendChild(langs);

    gallery.appendChild(card);

    

}
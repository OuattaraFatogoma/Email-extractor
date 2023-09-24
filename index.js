const inputForm=  document.querySelector("form");
const startBut = document.querySelector(".startBut");
const site=document.getElementById("site");
const email=document.getElementById("email");
const title=document.getElementById("title");
const country=document.getElementById("country");
const location=document.getElementById("location");
const inKeywords=document.getElementById("inKeywords");
const outKeywords=document.getElementById("outKeywords");
const ErrorMessage=document.getElementById("error");
const EmailsZone=document.getElementById("emails")



//////////////////////////// Start Scraping ///////////////////  

startBut.addEventListener("click", async (event) =>{
    event.preventDefault();
    EmailsZone.innerText =""; // clear the emails textearea
    ////////////////////// Form validation ///////////////////
    if(site.value === "" || site.value== null || title.value === "" || title.value== null ){
        ErrorMessage.innerText= "Please fill obligatory boxes"
        ErrorMessage.style.color= "#f00";
    }

    else{
        ErrorMessage.innerText= "";
        //////////////////////////// After form validation /////////////
        const message = ("site:"+site.value + " \""+title.value+"\"" + " \""+country.value+"\"" 
        + " \""+location.value+"\"" + " \""+inKeywords.value+"\"" + " \""+outKeywords.value+"\"" + " +\""+email.value+"\"");
        
        console.log(message);
        const response = await fetch('/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
    
        if (response.ok) {
            const data = await response.json();
            console.log('Scraped data:', data);
            EmailsZone.value = data;
        } else {
            console.error('Error:', response.statusText);
        }
        console.log("finished");
    }

});




//////::::::::::::::: Functions ::::::::::::::////////////////////

function FormValidation(){

}
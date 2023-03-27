const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Perform login logic (e.g., call API, validate user)
    try {
      const response = await fetch('http://81.78.155.221:8000/loginUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        if(result.loginUser === true){
          //Saving token to localstorage on -> Successfull login
          localStorage.setItem("sessionToken",result.token);
          //Redirect user to Dahsboard on -> Successfull login                
          window.location = "dashboard";
      }
      modal(result.message);
        // Redirect or update UI accordingly
      } else {
        console.error('Login failed:', response.statusText);
        // Show error message to user
      }
    } catch (err) {
      console.error('Error:', err);
      // Show error message to user
    }
  });
}

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstname = document.getElementById('signup-firstname').value;
      const lastname = document.getElementById('signup-lastname').value;
      const firstLineAddress = document.getElementById('signup-address1').value;
      const city = document.getElementById('signup-city').value;
      const postcode = document.getElementById('signup-postcode').value;
      const phoneNumber = document.getElementById('signup-phone').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
  
      // Perform signup logic (e.g., call API, register user)
      try {
        const response = await fetch('http://81.78.155.221:8000/registerUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstname, lastname, firstLineAddress, city, postcode, phoneNumber, email, password }),
        });

      if (response.ok) {
        const data = await response.json();
        modal(data.message)
        // Redirect or update UI accordingly
      } else {
        console.error('Signup failed:', response.statusText);
        // Show error message to user
      }
    } catch (err) {
      console.error('Error:', err);
      // Show error message to user
    }
  });
}

let btnLogout = document.getElementById("logout-btn")
if(btnLogout !== null){
  btnLogout.addEventListener("click", function () {
      window.location.href = "index.html";
  });
}


//Create modal on the screen with desired text
function modal(text){
  if(document.getElementById("modal")!=null){
      document.querySelector("#modal").style = "animation:modal-ease-out forwards .8s;"
      setTimeout(()=>{
          document.querySelector("#modal").remove();
      },800)
  }
  
  let modalContainer = document.createElement("div");
  let p             = document.createElement("p");
  let btnOK          = document.createElement("img");

  p.innerHTML        = text;
  btnOK.src          = "../images/icon-cancel.png"
  btnOK.onclick      = function(){
      document.querySelector("#modal").style = "animation:modal-ease-out forwards .8s;"
      setTimeout(()=>{
          document.querySelector("#modal").remove();
      },800)
  }

  modalContainer.id    = "modal";
  modalContainer.style = "display:block;";

  modalContainer.appendChild(p);
  modalContainer.appendChild(btnOK);
  document.getElementsByTagName("body")[0].appendChild(modalContainer);

}

function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
      tabContents[i].style.display = "none";
    }
  
    const tabLinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }
  
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }
  
  
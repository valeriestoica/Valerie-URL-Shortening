////////////////////////////////
// LOCAL STORAGE INITIALIZATION
// OUTPUT SHORTLINKS IN STORAGE
////////////////////////////////

// local storage shortlink_data array structure:
// [
//  {link     : link1,
//   shortlink: shortlink1},
//  {link     : link2,
//   shortlink: shortlink2}...
// ]
// let shortlink_data = JSON.parse(localStorage.getItem('shortlink_data'))
let shortlink_data = localStorage.getItem('shortlink_data')

if(shortlink_data == null) { 
  //initialize local storage varable
  localStorage.setItem('shortlink_data', JSON.stringify([]))
} else { 
  //load shorlinks
  let data = JSON.parse(shortlink_data)
  data.forEach((item) => {
    const {link, shortlink} = item
    console.log(link)

    const container = document.querySelector('.shortlinks-container')
    const template = document.querySelector('#shortlink-card-template')

    let clone = template.content.firstElementChild.cloneNode(true)
    const link_clone = clone.querySelector('.link')
    const shortlink_clone = clone.querySelector('.shortlink')
    const copy_btn_clone = clone.querySelector('.btn')

    link_clone.textContent = link
    shortlink_clone.textContent = shortlink
    copy_btn_clone.addEventListener('click', e => {
      e.preventDefault()

      navigator.clipboard.writeText(shortlink_clone.innerText)
      copy_btn_clone.innerText = 'Copied!'
      copy_btn_clone.classList.add('btn-copied')
    })

    container.appendChild(clone)
  })
}



////////////////////////////
//// FORM VALIDATION
////////////////////////////

import FormValidator from './FormValidator.js'

// fHandler is a form handler which defines the logic/behavior
// when a form is submitted. This can be passed to the FormValidator
// class. When no form handler is provided, the form submits using its
// default behavior.

let fHandler = (form) => {
  const data = new FormData(form)
  const [[name,url]] = [...data]
  const API_URL = 'https://api.shrtco.de/v2/shorten?url='

  fetch(API_URL + url)
    .then( response => {
      return response.json()
    })
    .then( data => {
      if(data.ok) {
        const shortlink = data.result.full_short_link

        const container = document.querySelector('.shortlinks-container')
        const template = document.querySelector('#shortlink-card-template')

        let clone = template.content.firstElementChild.cloneNode(true)
        const link_clone = clone.querySelector('.link')
        const shortlink_clone = clone.querySelector('.shortlink')
        const copy_btn_clone = clone.querySelector('.btn')
            

        link_clone.textContent = url
        shortlink_clone.textContent = shortlink
        copy_btn_clone.addEventListener('click', e => {
          e.preventDefault()

          navigator.clipboard.writeText(shortlink_clone.innerText)
          copy_btn_clone.innerText = 'Copied!'
          copy_btn_clone.classList.add('btn-copied')
        })

        container.appendChild(clone)
        form.reset()

        //add to data to local storage
        let data_storage = JSON.parse(localStorage.getItem('shortlink_data'))

        data_storage.push({
          link      : url,
          shortlink : shortlink
        })

        localStorage.setItem('shortlink_data', JSON.stringify(data_storage))
      } else {
        form.querySelector(".error-message").textContent = "Please enter a valid URL"
        form.querySelector('#url').classList.add('error-outline')
      }
    })
    .catch( error => {
      form.querySelector(".error-message").textContent = "Failed to shorten link. Please try again"
      form.querySelector('#url').classList.add('error-outline')
      console.log(error)
    })
}

const fv = new FormValidator('#form-shorten', fHandler)

// register(inputSelector, check): register an input field and a check logic
//
// check is a function which defines the
// validation logic of an input field. Must return an object with the pass
// result and its corresponding error message when it fails.
//
// in this case, if the input is empty... then an error message is thrown
fv.register("#url", (value, inputField) => {
  if(value.length == '') {
    return {
      pass: false,
      error: "Please add a link"
    }
  }

  return {
    pass: true,
  }
})

////////////////////////////
//// MOBILE NAVIGATION
////////////////////////////

document.querySelector(".btn-mobile-nav")
  .addEventListener( 'click', () => {
    document.querySelector(".nav-header")
      .classList.toggle('nav-open')
  })

//close nav when clicked outside 
document.addEventListener('click', (e) => {
  //return true when clicked inside
  const header = document.querySelector('.nav-header')
  const isinside = e.target.closest(".main-nav")?true:false

  //return true when menu button is clicked
  const isbtn = e.target.closest('.btn-mobile-nav')?true:false

  if(!isinside && !isbtn && header.classList.contains('nav-open')) {
    header.classList.remove('nav-open')
  }
})
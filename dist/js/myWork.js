const menuBtn = document.querySelector('.menu-btn')
const menu = document.querySelector('.menu')
const menuNav = document.querySelector('.menu-nav')
const menuBranding = document.querySelector('.menu-branding')

const navItems = document.querySelectorAll('.nav-item')

let showMenu = false;
let closeOption = false;

menuBtn.addEventListener('click', toggleMenu);

function toggleMenu() {
    console.log('closeOption: ', closeOption);
    console.log('showMenu: ', showMenu);
    if(!closeOption) {
        if(!showMenu) {
            menuBtn.classList.add('close');
            menu.classList.add('show');
            menuNav.classList.add('show');
            menuBranding.classList.add('show');
            navItems.forEach(item => item.classList.add('show'));
            showMenu = true;
            return;
        } else {
            menuBtn.classList.remove('close');
            menu.classList.remove('show');
            menuNav.classList.remove('show');
            menuBranding.classList.remove('show');
            navItems.forEach(item => item.classList.remove('show'));
            showMenu = false;
            return;
        }
    } else {
        toggleProjectDetails(closeOption);
    }
}

const project1 = document.querySelector('.project-1').addEventListener("click", function() { toggleProjectDetails('1') });
const project2 = document.querySelector('.project-2').addEventListener("click", function() { toggleProjectDetails('2') });
const project3 = document.querySelector('.project-3').addEventListener("click", function() { toggleProjectDetails('3') });
const project4 = document.querySelector('.project-4').addEventListener("click", function() { toggleProjectDetails('4') });
const project5 = document.querySelector('.project-5').addEventListener("click", function() { toggleProjectDetails('5') });

function toggleProjectDetails(projectNumber) {
    console.log('clicked')
    if(!closeOption) {
        menuBtn.classList.add('close');
        document.querySelector('.projectInfo-' + projectNumber).classList.add('show');
        document.querySelector('.projectInfo-' + projectNumber + ' .projectContent').classList.add('show');
        closeOption = projectNumber;
        return;
    } else {
        document.querySelector('.projectInfo-' + projectNumber).classList.remove('show');
        document.querySelector('.projectInfo-' + projectNumber + ' .projectContent').classList.remove('show');
        menuBtn.classList.remove('close');
        showMenu = false;
        closeOption = false;
    }
}
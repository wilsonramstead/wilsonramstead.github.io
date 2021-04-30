const menuBtn = document.querySelector('.menu-btn')
const menu = document.querySelector('.menu')
const menuNav = document.querySelector('.menu-nav')
const menuBranding = document.querySelector('.menu-branding')

const navItems = document.querySelectorAll('.nav-item')

let showMenu = false;
let closeOption = false;

menuBtn.addEventListener('click', toggleMenu);

function toggleMenu() {
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
        toggleAboutDetails(closeOption);
    }
}

// about Details page:
const job1 = document.querySelector('.job-1').addEventListener("click", function() { toggleAboutDetails('1') });
const job2 = document.querySelector('.job-2').addEventListener("click", function() { toggleAboutDetails('2'); });
const job3 = document.querySelector('.job-3').addEventListener("click", function() { toggleAboutDetails('3'); });

function toggleAboutDetails(jobNumber) {
    if(!closeOption) {
        menuBtn.classList.add('close');
        document.querySelector('.jobInfo-' + jobNumber).classList.add('show');
        document.querySelector('.jobInfo-' + jobNumber + ' .aboutContent').classList.add('show');
        closeOption = jobNumber;
        return;
    } else {
        document.querySelector('.jobInfo-' + jobNumber).classList.remove('show');
        document.querySelector('.jobInfo-' + jobNumber + ' .aboutContent').classList.remove('show');
        menuBtn.classList.remove('close');
        showMenu = false;
        closeOption = false;
    }
}
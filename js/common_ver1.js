// =========================
// UTILITY FUNCTIONS
// =========================

// DOM 유틸리티 - 안전한 element 선택
const safeQuerySelector = (selector, context = document) => {
    try {
        return context.querySelector(selector);
    } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return null;
    }
};

const safeQuerySelectorAll = (selector, context = document) => {
    try {
        return context.querySelectorAll(selector);
    } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return [];
    }
};

// 클래스 조작 유틸리티
const toggleClass = (elements, className, force = undefined) => {
    if (!elements) return;

    const elementsArray = Array.isArray(elements) ? elements : [elements];
    elementsArray.forEach(el => {
        if (el && el.classList) {
            if (force !== undefined) {
                el.classList.toggle(className, force);
            } else {
                el.classList.toggle(className);
            }
        }
    });
};

const addClass = (elements, className) => {
    toggleClass(elements, className, true);
};

const removeClass = (elements, className) => {
    toggleClass(elements, className, false);
};



// =========================
// ORIGINAL FUNCTIONS (REFACTORED)
// =========================

// modal
const setModal = (target) => {
    const targetElement = typeof target === 'string' ? safeQuerySelector(`#${target}`) : target;
    if (!targetElement) return;

    targetElement.style.display = 'flex';
/*
    setTimeout(() => {
        addClass(targetElement, 'is-active');
        if (!document.body.classList.contains('modal-open')) {
            addClass(document.body, 'modal-open');
        }
    }, 300);
*/
    requestAnimationFrame(() => {
        addClass(targetElement, 'is-active');
        addClass(document.body, 'modal-open');
    });
}
window.setModal = setModal;

// 모달 열기
const openModal = (event, type) => {
    event.preventDefault();
    const btn = event.currentTarget;
    const modalId = btn.getAttribute('data-modal-id');
    

    const target = safeQuerySelector(`#${modalId}`);
    if (target) {
        setModal(modalId);
    }
};
window.openModal = openModal;

// 모달 외부 클릭 이벤트 핸들러
/* 외부 클릭 이벤트 주석처리
document.addEventListener("click", function(e) {
    if (e.target.classList.contains('modal__wrap--bg')) {
        setTimeout(() => {
            removeClass(e.target, 'is-active');
            removeClass(document.body, 'modal-open');
        }, 300);
        e.target.style.display = 'none';
    }
});
*/

//모달창 닫기
const closeModal = (event, openButton) => {
    const btn = event.currentTarget;
    const activeModal = btn.closest('.cmp-modal');

    const totalModal = safeQuerySelectorAll('.cmp-modal.is-active');
    const modalLength = totalModal.length;

    if (activeModal) {
        removeClass(activeModal, 'is-active');

        if (modalLength <= 1) {
            removeClass(document.body, 'modal-open');

            setTimeout(() => {
                activeModal.style.display = 'none';
            }, 300);
        }
    }
};
window.closeModal = closeModal;

/* gnb - pc */
let gnbEnterHandler = null;
let gnbLeaveHandler = null;
function gnbOpen(){
    const gnbList = document.querySelector(".gnb");
    if(!gnbList) return;

    const listItem = gnbList.querySelectorAll(".gnb > li > a");
    
    gnbEnterHandler = (e) => {
        if(!gnbList.classList.contains('active')){
            gnbList.classList.add('active');
        }
    };
    gnbLeaveHandler = () => gnbList.classList.remove('active');

    listItem.forEach(el => el.addEventListener('mouseenter', gnbEnterHandler));
    gnbList.addEventListener('mouseleave', gnbLeaveHandler);
}

function destroyGnbOpen(){
    const gnbList = document.querySelector(".gnb");
    if(!gnbList) return;
    const listItem = gnbList.querySelectorAll(".gnb > li > a");

    if(gnbEnterHandler) listItem.forEach(el => el.removeEventListener('mouseenter', gnbEnterHandler));
    if(gnbLeaveHandler) gnbList.removeEventListener('mouseleave', gnbLeaveHandler);

    gnbEnterHandler = null;
    gnbLeaveHandler = null;
}

// 상단 설문 종료버튼
const topClose = () => {
    const wrap = document.querySelector('.noti-wrap');
    const btn = document.querySelector('.btn-noti-close');

    if (!wrap.classList.contains('open')) {
        // 열기
        wrap.style.height = wrap.scrollHeight + 'px';
        wrap.classList.add('open');
        btn.textContent = '팝업닫기';
        btn.classList.add('close');
    } else {
        // 닫기
        wrap.style.height = wrap.scrollHeight + 'px';
        requestAnimationFrame(() => {
            wrap.style.height = '0';
        });
        wrap.classList.remove('open');
        btn.textContent = '팝업열기';
        btn.classList.remove('close');
    }
};

// 메인배너 우측 Accordion list 토글
const bnToggle = () => {
    const isMobile = window.innerWidth < 1024;

    const setLiHeight = (li) => {
        li.style.height = li.scrollHeight / 10 + 'rem';
    };

    const activeList = document.querySelector(".acco-wrap li.active");
    if(activeList){
        setTimeout(()=>{
            setLiHeight(activeList);
        }, 200);
    }
    
    const accoBtn = document.querySelectorAll(".acco-wrap li.item > button");
    accoBtn.forEach((el)=>{
        el.addEventListener("click", (e)=>{
            e.preventDefault();
            e.stopPropagation();
            const li = el.parentElement;
            const isActive = li.classList.contains('active');

            if(isActive){
                return
            }else{
                document.querySelectorAll(".acco-wrap li").forEach((el)=>{
                    el.classList.remove('active');
                    if(!isMobile){
                        el.style.height = 11 + 'rem';
                    }else{
                        el.style.height = 9 + 'rem';
                    }
                });
                li.classList.add('active');
                setLiHeight(li);
            }
        });
    });
}

// 검색영역 높이 초기화
function setItemHeight(item){
    const content = item.querySelector('.acco-con');
    if(!content) return;

    // 실제 높이 가져오기(px)
    const realHeight = content.scrollHeight;

    // px를 rem으로 변환
    const remHeight = realHeight / 10;

    item.style.minHeight = remHeight + 'rem';
}

// 검색영역 높이 재계산 함수
function resetItemHeight(item){
    item.style.minHeight = '';
}

const accoSch = () => {
    const wrap = document.querySelector(".acco-wrap.search");
    if(!wrap) return;

    const items = wrap.querySelectorAll(".item");

    items.forEach(item => {
        resetItemHeight(item);  // 초기화
        setItemHeight(item);    // 재계산
    });
    

    const activeList = document.querySelector(".acco-wrap.search .item.active");
    if(activeList){
        setTimeout(()=>{
            setItemHeight(activeList);
        }, 200);
    }

    const accoBtn = document.querySelectorAll(".acco-wrap.search .item .icon-acco");
    accoBtn.forEach((el)=>{
        el.addEventListener("click", (e)=>{
            e.preventDefault();
            e.stopPropagation();
            const targetItem = el.closest(".item");
            const isActive = targetItem.classList.contains('active');

            if(isActive){
                targetItem.classList.remove('active');
                targetItem.style.minHeight = 6.5 + 'rem';
            }else{
                targetItem.classList.add('active');
                setItemHeight(targetItem);
            }
        });
    });
}

// dropdown
function DropdownMenus() {
    const dropdownButtons = document.querySelectorAll(".btn-dropdown");

    if (!dropdownButtons.length) return;

    dropdownButtons.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();

            const currentWrap = btn.closest(".dropdown-wrap");
            const isOpen = currentWrap.classList.contains("is-open");

            // 모든 드롭다운 닫기
            document.querySelectorAll(".dropdown-wrap.is-open").forEach((openWrap) => {
                openWrap.classList.remove("is-open");
            });

            if (!isOpen) {
                currentWrap.classList.add("is-open");
            }
        });
    });

    // 클릭 시 텍스트 변경
    document.querySelectorAll(".dropdown-select .dropdown-item").forEach((item) => {
        item.addEventListener("click", function (e) {
            e.stopPropagation();

            const selectedText = item.textContent;
            const wrap = item.closest(".dropdown-wrap");
            const btn = wrap.querySelector(".btn-dropdown");

            btn.textContent = selectedText;
            wrap.classList.remove("is-open");
        });
    });

    // 클릭 시 이동하고 닫기
    document.querySelectorAll(".dropdown-link .dropdown-item").forEach((item) => {
        item.addEventListener("click", function () {
            const wrap = item.closest(".dropdown-wrap");
            wrap.classList.remove("is-open");
        });
    });

    // 바깥 클릭 시 닫기
    document.addEventListener("click", function () {
        document.querySelectorAll(".dropdown-wrap.is-open").forEach((openWrap) => {
            openWrap.classList.remove("is-open");
        });
    });
}


let tabEventRegistry = [];
let moDropdownRegistry = [];
let mobileMenuHandler = null;
let parentTabRegistry = [];
let subTabRegistry = [];

// tab
function initTabs(containerSelector) {
    const containers = safeQuerySelectorAll(containerSelector);
    if (!containers.length) return;

    containers.forEach(container => {
        const tabMenuWrap = container.querySelector('.tab-head');
        if (!tabMenuWrap) return;

        const tabMenus = tabMenuWrap.querySelectorAll('.tab-menu');
        const handler = (event) => {
            const clickedTab = event.target.closest('.tab-menu');
            if (!clickedTab || !tabMenuWrap.contains(clickedTab)) return;
            if(clickedTab.classList.contains('is-active')) return;

            tabMenus.forEach(tab => removeClass(tab, 'is-active'));
            addClass(clickedTab, 'is-active');

            const targetId = clickedTab.getAttribute('data-tab');
            const targetContent = container.querySelector(`#${targetId}`);
            if (targetContent) {
                const siblings = Array.from(targetContent.parentElement.children);
                siblings.forEach(content => removeClass(content, 'is-active'));
                addClass(targetContent, 'is-active');
            }
        };

        tabMenuWrap.addEventListener('click', handler);

        if(container.classList.contains('sub')) {
            subTabRegistry.push({ element: tabMenuWrap, handler });
        } else {
            parentTabRegistry.push({ element: tabMenuWrap, handler });
        }
    });
}

function destroyParentTabs() {
    parentTabRegistry.forEach(entry => {
        entry.element.removeEventListener('click', entry.handler);
    });
    parentTabRegistry = [];
}

// mobile 라디오, 탭 드롭다운 공통처리
function initMoDropdown() {
    const dropdowns = document.querySelectorAll('.mo-drop');

    dropdowns.forEach(dropdown => {
        const toggleButton = dropdown.querySelector('.mo-btn-dropdown');
        const dropdownList = dropdown.querySelector('.mo-dropdown-list');
        const items = dropdownList.querySelectorAll('.tab-menu, .radio-item');

        // toggle handler
        const toggleHandler = (e) => {
            e.stopPropagation();
            document.querySelectorAll('.mo-drop.is-open').forEach(d => {
                if(d !== dropdown) removeClass(d, 'is-open');
            });
            toggleClass(dropdown, 'is-open');
        };
        toggleButton.addEventListener('click', toggleHandler);
        moDropdownRegistry.push({ element: toggleButton, handler: toggleHandler });

        // item click handler
        items.forEach(item => {
            const itemHandler = (e) => {
                e.stopPropagation();
                let labelText = '';

                if(item.classList.contains('tab-menu')) {
                    const tabId = item.getAttribute('data-tab');
                    const container = dropdown.closest('.tab-container');
                    if(container){
                        const tabMenus = container.querySelectorAll('.mo-dropdown-list .tab-menu');
                        const tabContents = container.querySelectorAll('.mo-drop + .tab-content-wrap > .tab-content');

                        tabMenus.forEach(menu => removeClass(menu,'is-active'));
                        addClass(item,'is-active');

                        tabContents.forEach(content => {
                            removeClass(content,'is-active');
                            if(content.id === tabId) addClass(content,'is-active');
                        });
                    }
                    labelText = item.textContent;
                }

                if(item.classList.contains('radio-item')) {
                    const input = item.querySelector('input[type="radio"]');
                    if(input){
                        input.checked = true;
                        const name = input.getAttribute('name');
                        document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
                            removeClass(r.closest('.radio-item'),'is-active');
                        });
                        addClass(item,'is-active');
                        labelText = item.textContent.trim();
                    }
                }

                if(labelText) toggleButton.textContent = labelText;
                removeClass(dropdown, 'is-open');
            };
            item.addEventListener('click', itemHandler);
            moDropdownRegistry.push({ element: item, handler: itemHandler });
        });
    });

    document.addEventListener('click', closeAllMoDropdowns);
}

function closeAllMoDropdowns() {
    document.querySelectorAll('.mo-drop.is-open').forEach(open => removeClass(open,'is-open'));
}

function destroyMoDropdown() {
    moDropdownRegistry.forEach(entry => entry.element.removeEventListener('click', entry.handler));
    moDropdownRegistry = [];
    document.removeEventListener('click', closeAllMoDropdowns);
}


// bbs - accordion
function bbsAccoFn() {
    const accoBtn = document.querySelectorAll('.bbs-list.acco li .btn-acco');
    if (!accoBtn) return;

    accoBtn.forEach((el) => {
        el.addEventListener('click', (e) => {
            const targetItem = e.currentTarget.closest("li");
            const list = targetItem.parentElement.querySelectorAll("li");
            const isOpen = targetItem.classList.contains('on'); // 이미 열려있는지 체크

            // 모든 형제 li에서 on 제거
            list.forEach(li => {
                li.classList.remove('on');
            });

            // 이미 열려 있었다면 닫기만 하고 종료
            if (isOpen) return;

            // 닫혀 있었다면 열기
            targetItem.classList.add('on');
        });
    });
}

// main intro bg(random)
function bgRandomFn(){
    const banner = document.querySelector('.main-bn');
    if(!banner) return;

    const randomBg = Math.random() < 0.5 ? 'bg1' : 'bg2';
    if(randomBg) banner.classList.add(randomBg);
    requestAnimationFrame(() => banner.classList.add('show'));
}

// mobile - 상단 검색버튼
function moBtnSchFn(){
    const btn = document.querySelector('.mo-btn-grp .mo-btn-search');
    const target = document.querySelector('.head-top .sch-area');

    if(!btn || !target) return

    btn.addEventListener('click', (e)=>{
        e.currentTarget.classList.toggle('close');

        if(e.currentTarget.classList.contains('close')){
            e.currentTarget.textContent = "닫기버튼";
            target.classList.add('active');
        }else{
            e.currentTarget.textContent = "검색버튼";
            target.classList.remove('active');
        }
    });
}

// mobile - 상단 전체메뉴   
function allMnuFn() {
    const header = document.querySelector('header');
    const btn = document.querySelector('.mo-btn-grp .mo-btn-mnu');
    const btnSch = document.querySelector('.mo-btn-grp .mo-btn-search');
    const target = document.querySelector('header .head-bottom');
    if(!header || !btn || !btnSch || !target) return;
    const gnbBtn = target.querySelectorAll('.gnb > li');

    // 기존 핸들러 제거
    if(mobileMenuHandler) btn.removeEventListener('click', mobileMenuHandler);

    mobileMenuHandler = (e) => {
        target.classList.toggle('mo-open');
        toggleClass(header,'bg');
        e.currentTarget.classList.toggle('close');
        if(e.currentTarget.classList.contains('close')){
            e.currentTarget.textContent = "메뉴닫기";
            btnSch.style.display = 'none';
        } else {
            e.currentTarget.textContent = "메뉴열기";
            btnSch.style.display = 'block';
        }
    };

    btn.addEventListener('click', mobileMenuHandler);

    gnbBtn.forEach((el)=>{
        el.addEventListener('click',(e)=>{
            e.stopPropagation();
            const li = e.target.closest('li'); // 클릭 대상의 li
            if(!li) return;

            const isActive = li.classList.contains('active');
            gnbBtn.forEach(l => removeClass(l,'active'));

            if(!isActive) addClass(li,'active');
        });
    });
}

function destroyAllMnuFn(){
    const btn = document.querySelector('.mo-btn-grp .mo-btn-mnu');
    if(btn && mobileMenuHandler){
        btn.removeEventListener('click', mobileMenuHandler);
        mobileMenuHandler = null;
    }
}

function tooltipFn(){
    const btn = document.querySelectorAll(".tooltip-grp .btn-tooltip");
    if(!btn) return;

    btn.forEach((el)=>{
        el.addEventListener('click', (e)=>{

            if(e.currentTarget.classList.contains('on')){
                e.currentTarget.classList.remove('on');
            }else{
                e.currentTarget.classList.add('on');
            }
        });
    });
}


function btnTopFn(){
    const btnTop = document.querySelector("#btnTop");;

    if(!btnTop) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            btnTop.classList.add("show");
        } else {
            btnTop.classList.remove("show");
        }
    });

    btnTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// 개인정보처리방침
function accoOpenByAnchor() {
    const anchorLinks = document.querySelectorAll('a[href^="#cont"]');

    if(!anchorLinks) return;

    anchorLinks.forEach(a => {
        a.addEventListener("click", (e) => {
            const targetId = a.getAttribute("href"); // #cont1
            const targetLi = document.querySelector(targetId);

            if (!targetLi) return;

            // 기본 앵커 스크롤 작동 전에 아코디언 열어주기
            setTimeout(() => {
                // 동일 리스트 내의 모든 .on 제거
                const parentList = targetLi.parentElement.querySelectorAll("li");
                parentList.forEach(li => li.classList.remove("on"));

                // 해당 li만 ON
                targetLi.classList.add("on");

                // 아코디언 열리고 난 뒤 정확한 위치로 스크롤 재조정
                targetLi.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
        });
    });
}

//pc에서도 drag하여 scroll처리
const tabScrollFn = function(){
    const slider = document.querySelectorAll('.notice-wrap .tab-head');
    if(slider){
        let isDown = false;
        let startX;
        let scrollLeft;
    
        slider.forEach((el)=>{
            el.addEventListener('mousedown', (e) => {
                isDown = true;
                el.classList.add('active');
                startX = e.pageX - el.offsetLeft;
                scrollLeft = el.scrollLeft;
            });
            
    
            el.addEventListener('mouseleave', () => {
                isDown = false;
                el.classList.remove('active');
            });
    
            el.addEventListener('mouseup', () => {
                isDown = false;
                el.classList.remove('active');
            });
    
            el.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - el.offsetLeft;
                const walk = (x - startX) * 1.5; // 속도 조절
                el.scrollLeft = scrollLeft - walk;
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    DropdownMenus();
    bnToggle();
    initTabs('.tab-container.full');
    initTabs('.tab-container.sub');
    initTabs('.tab-container.notice-wrap');
    accoSch();
    bbsAccoFn();
    bgRandomFn();
    tooltipFn();
    btnTopFn();
    accoOpenByAnchor();
    tabScrollFn();

    initByMode();
});

let isMobileMode = window.innerWidth < 1024;

function initByMode() {
    if (isMobileMode) {
        // 이전 이벤트 제거
        destroyParentTabs();
        destroyMoDropdown();
        destroyGnbOpen();

        // 이벤트 등록
        initMoDropdown();
        allMnuFn();
        moBtnSchFn();
    } else {
        // 모바일 이벤트 제거
        destroyMoDropdown();
        destroyAllMnuFn();

        // PC 이벤트 등록
        initTabs('.tab-container.full');
        initTabs('.tab-container.sub');
        initTabs('.tab-container.notice-wrap');
        gnbOpen();
    }
}

// 리사이징 대응
window.addEventListener('resize',()=>{
    const nowMobile = window.innerWidth < 1024;
    if(nowMobile !== isMobileMode){
        isMobileMode = nowMobile;
        initByMode();
    }
});

import { gsap } from "gsap";
export class BurgerMenu {

  constructor(params) {

    this.$btnOpen = document.querySelector(`#${params.btnOpen}`)
    this.$btnClose = document.querySelector(`#${params.btnClose}`)
    this.$wrapList = document.querySelector(`#${params.wrapList}`)
    this.$list = document.querySelector(`#${params.list}`)
    this.$items = document.querySelectorAll(`.${params.item}`)
    this.$links = document.querySelectorAll(`.${params.link}`)
    this.$contactPhone = document.querySelector(`#${params.contactPhone}`)
    this.widthWindow = document.documentElement.clientWidth

    this.tlOpenBurger = gsap.timeline({paused: true})
    .set([this.$wrapList, this.$items, this.$btnClose, this.$contactPhone], {opacity: 0})
    .to(this.$wrapList, {opacity: 1, duration: 0.5, onStart: () => {
      this.$wrapList.classList.remove('display-none')
      this.$wrapList.classList.add('flex', 'flex-column')
    }})
    .fromTo(this.$items, {x: 200}, {x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: -0.5})
    .fromTo(this.$btnClose, {y: -20}, {y: 0, opacity: 1, duration: 0.5})
    .fromTo(this.$contactPhone, {y: 20}, {y: 0, opacity: 1, duration: 0.5, delay: -0.5, onComplete: () => {
      this.cleanAttributes(this.$contactPhone)
      for (const item of this.$items) {
        this.cleanAttributes(item)
      }

    }})

    this.tlCloseBurger = gsap.timeline({paused: true})
    .to(this.$wrapList, {rotationX: 90, duration: 0.3, onComplete: () => {
      this.$wrapList.classList.add('display-none')
      this.$wrapList.classList.remove('flex', 'flex-column')
      this.cleanAttributes(this.$wrapList)
      this.cleanAttributes(this.$contactPhone)
      for (const item of this.$items) {
        this.cleanAttributes(item)
      }
    }})


    // events
    window.addEventListener('resize', () => {
      this.widthWindow = document.documentElement.clientWidth
    })


    this.$btnOpen.addEventListener('click', () => {
      this.tlOpenBurger.play()
      this.tlOpenBurger.restart()
    })
    this.$btnClose.addEventListener('click', () => {
      this.tlCloseBurger.play()
      this.tlCloseBurger.restart()
    })

    for (const link of this.$links) {
      link.addEventListener('click', () => {
        if (this.widthWindow <= 520) {
          this.tlCloseBurger.play()
          this.tlCloseBurger.restart()}
      })
    }

    this.$contactPhone.addEventListener('click', () => {
      this.tlCloseBurger.play()
      this.tlCloseBurger.restart()
    })

    this.cleanAttributes(this.$wrapList)
    this.cleanAttributes(this.$contactPhone)
    for (const item of this.$items) {
      this.cleanAttributes(item)
    }
  }

  setUnwrapMenu() {
    this.$wrapList.classList.remove('display-none', 'flex', 'flex-column')
    this.$btnClose.classList.add('display-none')
    this.$contactPhone.classList.add('display-none')
  }
  setBurgerMenu() {
    this.$wrapList.classList.add('display-none')
    this.$btnClose.classList.remove('display-none')
    this.$contactPhone.classList.remove('display-none')
  }

  cleanAttributes(elem) {
    if (elem.hasAttribute('style')) elem.removeAttribute('style')
  }

  get widthWindow() {
    return this._widthWindow
  }
  set widthWindow(value) {
    this._widthWindow = value

    if (value <= 520) {
      this.setBurgerMenu()
      }
    else {
      this.setUnwrapMenu()
      }
    }
}

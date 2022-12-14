// 商品详情页
const initCart = {
  url: 'item.jd',
  btn: '#InitCartUrl'
}
// 去购物车结算
const CardCenter = {
  url: 'addToCart',
  btn: '#GotoShoppingCart'
}
// 购物车
const cartPage = {
  url: 'cart_index',
  btn: '.cart-floatbar .common-submit-btn'
}
// 提交订单
const submitPage = {
  url: 'trade.jd.com/shopping/order',
  btn: '#order-submit'
}

// 秒杀间隔
let intervalTime = 250
chrome.storage.local.get('intervalTime', val => {
  intervalTime = val.intervalTime || 250
})

// 抢购时间
let buyTime = '2022-12-15T20:00'
chrome.storage.local.get('buyTime', val => {
  buyTime = val.buyTime || '2022-12-15T20:00'
})

const locationHref = location.href;
let timer;
var count = 1;

let main = () => {
  const isInit = Date.now() >= new Date(buyTime).getTime();

  if (!isInit) return;
  
    console.log("开始抢购" + Date.now());

    //加入购物车
    if (locationHref.includes(initCart.url)) {
      if (document.querySelector(initCart.btn)) {
        console.log("(++++++++++++正在秒杀");
        document.querySelector(initCart.btn).click();
        return;
      }
    }

    //去购物车结算
    if (locationHref.includes(CardCenter.url)) {
      if (document.querySelector(CardCenter.btn)) {
        console.log("(++++++++++++正在去购物车结算");
        document.querySelector(CardCenter.btn).click();
      }
    }

    //购物车-去结算
    if (locationHref.includes(cartPage.url)) {
      if (document.querySelector(cartPage.btn)) {
        document.querySelector(cartPage.btn).click();
      }
    }
    
    //提交订单order-submit
    if (locationHref.includes(submitPage.url)) {
      if (document.querySelector(submitPage.btn)) {
        console.log("(++++++++++++正在提交订单");
        // document.querySelector(".payment-item item-selected online-payment")
        //在线支付
        // document.querySelector(submitPage.btn).click();
      }
    }
    
}


let run = () => {
  timer = setInterval(() => {
    main()
  }, intervalTime)
}

$('body').append(
  `<div id="helper-setting-button">
    <div>抢购设置</div>
  </div>`
)

$('#helper-setting-button').click(() => {
  $('body').append(
    `<div id="helper-setting">
      <div class="helper-setting-form">
        <div class="helper-setting-form-title">抢购设置</div>
        <div class="helper-setting-form-item">
          <label>秒杀间隔：</label>
          <input id="helper-setting-interval" class="helper-setting-form-item-interval" value="${intervalTime}"/>
          <label>（单位：毫秒）</label>
        </div>
        <div class="helper-setting-form-item">
          <label>抢购时间：</label>
          <input id="helper-setting-time" type="datetime-local" value="${buyTime}"/>
        </div>
        <div class="helper-setting-form-item">
          <div id="helper-setting-save-button" class="helper-setting-form-item-button">保存</div>
          <div id="helper-setting-cancel-button" class="helper-setting-form-item-button">取消</div>
        </div>
      </div>
    </div>`
  )

  // 保存按钮
  $('#helper-setting-save-button').click(() => {
    clearInterval(timer)
    intervalTime = $('#helper-setting-interval').val()
    chrome.storage.local.set({ 'intervalTime': intervalTime })
    buyTime = $('#helper-setting-time').val()
    chrome.storage.local.set({ 'buyTime': buyTime })
    $('#helper-setting').remove()
    run()
  })

  // 取消按钮
  $('#helper-setting-cancel-button').click(() => {
    $('#helper-setting').remove()
    clearInterval(timer)
  })
})

if (!locationHref.includes(initCart.url)) {
  run()
}

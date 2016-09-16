var log = function() {
  console.log(arguments)
}

// 这个函数用来根据 weibo 对象生成一条微博的 HTML 代码
var weiboTemplate = function(weibo) {
  var w = weibo
  var t = `
    <div class="weibo-cell cell item">
      <img src="${ w.avatar }" class="avatar">
      <span>${ w.weibo }</span>
      <span class="right span-margin">${ w.created_time }</span>
      <span class="right span-margin">by: ${ w.name }</span>
      <div class="right span-margin">
        <button class="button-weibo-update" data-id="${ w.id }">更新</button>
        <button class="weibo-delete" data-id="${ w.id }">删除</button>
        <a href="#" class="class-button-weibo-comment">评论(${ w.comments_num })</a>
      </div>
      <div class="div-weibo-update hide">
        <input type="hidden" class="weibo_id_update" value="${ w.id }">
        <input name="weibo" class="input-weibo-update" placeholder="Weibo">
        <button class="class-button-weibo-update">更新</button>
      </div>
      <div class="comment-div hide">
        <input type="hidden" class="weibo_id_comment" name="weibo_id" value="${ w.id }">
        <input name="comment" class="input-weibo-comment" placeholder="Comment">
        <button class="button-weibo-comment">发表</button>
        <div class="class-div-c">
        </div>
      </div>
    </div>
  `
  return t
}

var commentTemplate = function(comment){
    var c = comment
    var t = `
        <div class="cell-inner item">
          <img src="${ c.avatar }" class="avatar-s">
          <span class="comment">${ c.comment }</span>
          <span class="time right span-margin">${ c.created_time }</span>
          <span class="name right span-margin">by:${ c.name }</span>
        </div>
    `
    return t
}

var cnTemplate = function(comment){
    var cn = comment
    var t = `
        <a href="#" class="class-button-weibo-comment">评论(${ cn })</a>
    `
    return t
}

var bindEventCommentToggle = function(){
    // 展开评论事件
    $('.weibo-container').on('click', '.class-button-weibo-comment', function(){
        $(this).parent().siblings('.comment-div').slideToggle()
        // 因为展开评论是一个超链接 a 标签
        // 所以需要 return false 来阻止它的默认行为
        // a 的默认行为是跳转链接，没有指定 href 的时候就跳转到当前页面
        // 所以需要阻止
        return false;
    })
}

var bindEventUpdateToggle = function(){
    // 展开更新按钮
    $('.weibo-container').on('click', '.button-weibo-update', function(){
        $(this).parent().nextAll('.div-weibo-update').slideToggle()
        $(this).parent().parent().siblings().children('.div-weibo-update').hide()
        // 因为展开评论是一个超链接 a 标签
        // 所以需要 return false 来阻止它的默认行为
        // a 的默认行为是跳转链接，没有指定 href 的时候就跳转到当前页面
        // 所以需要阻止
        return false;
    })
}

var bindEventWeiboAdd = function() {
    // 给按钮绑定添加 weibo 事件
    $('#id-button-weibo-add').on('click', function(){
      // 得到微博的内容并且生成 form 数据
      var weibo = $('#id-input-weibo').val()
      log('weibo,', weibo)
      var form = {
        weibo: weibo,
      }

      // 这个响应函数会在 AJAX 调用完成后被调用
      var response = function(r) {
          /*
          这个函数会被 weiboAdd 调用，并且传一个 r 参数进来
          r 参数的结构如下
          {
              'success': 布尔值,
              'data': 数据,
              'message': 错误消息
          }
          */
          // arguments 是包含所有参数的一个 list
          console.log('成功', arguments)
          log(r)
          if(r.success) {
              // 如果成功就添加到页面中
              // 因为添加微博会返回已添加的微博数据所以直接用 r.data 得到
              var w = r.data
              $('.weibo-container').prepend(weiboTemplate(w))
              alert("添加成功")
          } else {
              // 失败，弹出提示
              alert(r.message)
          }
      }

      // 把上面的 form 和 response 函数传给 weiboAdd
      // api 在 api.js 中，因为页面会先引用 api.js 再引用 weibo.js
      // 所以 weibo.js 里面可以使用 api.js 中的内容
      api.weiboAdd(form, response)
    })
}

var bindEventWeiboDelete = function() {
    // 绑定删除微博按钮事件
    $('.weibo-container').on('click', '.weibo-delete', function(){
      // 得到当前的 weibo_id
      var weiboId = $(this).data('id')
      log(weiboId)
      // 得到整个微博条目的标签
      var weiboCell = $(this).closest('.weibo-cell')

      // 调用 api.weiboDelete 函数来删除微博并且在删除成功后删掉页面上的元素
      api.weiboDelete(weiboId, function(response) {
          // 直接用一个匿名函数当回调函数传给 weiboDelete
          // 这是 js 常用的方式
          var r = response
          if(r.success) {
              console.log('成功', arguments)
              // slideUp 可以以动画的形式删掉一个元素
              $(weiboCell).slideUp()
              alert("删除成功")
          } else {
              console.log('错误', arguments)
              alert("删除失败")
          }
      })
    })
}

var bindEventWeiboUpdate = function() {
    // 给按钮绑定添加 weibo 事件
    $('.weibo-container').on('click','.class-button-weibo-update', function(){
      // 得到微博的内容并且生成 form 数据
      var weibo_id = $(this).parent().children('.weibo_id_update').val()
      var weibo = $(this).parent().children('.input-weibo-update').val()
      log('weibo,', weibo)
      log('weibo_id, ', weibo_id)
      var weiboCell = $(this).closest('.weibo-cell')
      var form = {
        weibo: weibo,
        weibo_id: weibo_id
      }

      // 这个响应函数会在 AJAX 调用完成后被调用
      var response = function(r) {
          /*
          这个函数会被 weiboAdd 调用，并且传一个 r 参数进来
          r 参数的结构如下
          {
              'success': 布尔值,
              'data': 数据,
              'message': 错误消息
          }
          */
          // arguments 是包含所有参数的一个 list
          console.log('成功', arguments)
          log(r)
          if(r.success) {
              // 如果成功就添加到页面中
              // 因为添加微博会返回已添加的微博数据所以直接用 r.data 得到
              var w = r.data
              $(weiboCell).slideUp()
              $('.weibo-container').prepend(weiboTemplate(w))
              alert("更新成功")
          } else {
              // 失败，弹出提示
              alert(r.message)
          }
      }

      // 把上面的 form 和 response 函数传给 weiboAdd
      // api 在 api.js 中，因为页面会先引用 api.js 再引用 weibo.js
      // 所以 weibo.js 里面可以使用 api.js 中的内容
      api.weiboUpdate(form, response)
    })
}

var bindEventWeiboComment = function() {
    // 给按钮绑定添加 weibo 事件
    $('.weibo-container').on('click', '.button-weibo-comment', function(){
      // 得到微博评论的内容并且生成 form 数据
      var weibo_id = $(this).parent().children('.weibo_id_comment').val()
      var comment = $(this).parent().children('.input-weibo-comment').val()
      log('comment,', comment)
      log('weibo_id, ', weibo_id)
      var commentCell = $(this).siblings('div.class-div-c')
      var commentItem = $(this).closest('.comment-div')
      var cnItem = $(this).parent().siblings('div.span-margin')
        var cnItemchild = $(this).parent().siblings('div.span-margin').children('.class-button-weibo-comment')
      log('debug commentCell', commentCell)
      var form = {
        comment: comment,
        weibo_id: weibo_id
      }

      // 这个响应函数会在 AJAX 调用完成后被调用
      var response = function(r) {
          /*
          这个函数会被 weiboAdd 调用，并且传一个 r 参数进来
          r 参数的结构如下
          {
              'success': 布尔值,
              'data': 数据,
              'message': 错误消息
          }
          */
          // arguments 是包含所有参数的一个 list
          console.log('成功', arguments)
          log(r)
          if(r.success) {
              // 如果成功就添加到页面中
              // 因为添加微博会返回已添加的微博数据所以直接用 r.data 得到
              var c = r.data
              log('c,',c)
              //$(weiboCell).slideUp()
              //$('.weibo-container').prepend(weiboTemplate(w))
              var cn = r.cn + 1
              log('debug cn, ',cn)
              $(commentCell).append(commentTemplate(c))
              $(cnItemchild).remove()
              $(cnItem).append(cnTemplate(cn))
              $(commentItem).show()
              alert("评论发表成功")
          } else {
              // 失败，弹出提示
              log('something is wrong')
              alert(r.message)
          }
      }

      // 把上面的 form 和 response 函数传给 weiboAdd
      // api 在 api.js 中，因为页面会先引用 api.js 再引用 weibo.js
      // 所以 weibo.js 里面可以使用 api.js 中的内容
      api.weiboComment(form, response)
    })
}

var bindEvents = function() {
    // 不同的事件用不同的函数去绑定处理
    // 这样逻辑就非常清晰了
    bindEventCommentToggle()
    bindEventUpdateToggle()
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboUpdate()
    bindEventWeiboComment()
}

// 页面载入完成后会调用这个函数，所以可以当做入口
$(document).ready(function(){
    // 用 bindEvents 函数给不同的功能绑定事件处理
    // 这样逻辑就非常清晰了
    bindEvents()
})

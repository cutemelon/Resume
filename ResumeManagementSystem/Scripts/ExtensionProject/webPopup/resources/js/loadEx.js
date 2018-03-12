/*
*作用：手动载入时，在页面上添加载入按钮
*/
console.log("loadEx loaded");
var apiHandle = new BroswerApiHandle().CreateHandle();

judgeInsertByUser();

/*
*判断是否是简历页面
*/
function judgeInsertByUser() {
    try {
        if (!siteHelper.IsWorksite()) {
            console.log("This not the correct page that we need!");
            return;
        }
        var siteName = siteHelper.CurPageInfo().Name;
        console.log(siteName);
        innitLoadExtension();
        loadExtension();
    } catch (e) {
        console.log(e);
    } 
}

/*
*加载点击按钮
*/
function loadExtension() {
    var divObj = document.createElement("div");
    divObj.setAttribute('id', 'userSEBtnDiv');
    divObj.innerHTML = '<div class="userStartExtensionBtn"><div style="margin-top: 40px">点击下方“查重”按钮进行查重</div><div id="userSEBtn" style="background-color: #4F94CD;color: #FFF;border: none;cursor: pointer;padding-left: 5px;padding-right: 5px;margin: 0 auto;margin-top: 10px;width: 50px">查重</div></div>';
    var first = document.body.firstChild;
    document.body.insertBefore(divObj, first);
}

/*
*绑定单击按钮方法
*/
function innitLoadExtension() {
    $(document).delegate('#userSEBtn', 'click', function () {
        $("#userSEBtnDiv").remove();
        apiHandle.extensionsWorkByUser();
    });
}

/*IHandler*/
var IHandler = function () { };
IHandler.prototype.hasContactInfo = function () {
    throw new Error("must implement this method: hasContactInfo");
};
IHandler.prototype.getContactInfo = function () {
    throw new Error("must implement this method: getContactInfo");
};
IHandler.prototype.getDataForSearch = function () {
    throw new Error("must implement this method: getDataForSearch");
};
IHandler.prototype.getAllIdentities = function () {
    throw new Error("must implement this method: getAllIdentities");
};
IHandler.prototype.getResumeId = function () {
    throw new Error("must implement this method: getResumeId");
};
IHandler.prototype.getResumeShowId = function () {
    throw new Error("must implement this method: getResumeId");
};
IHandler.prototype.uploadResume = function () {
    throw new Error("must implement this method: uploadResume");
};

/*HandlerFactory */
var HandlerFactory = function () { };

HandlerFactory.prototype.Create = function () {
    var _handler = null;
    var siteName = siteHelper.CurPageInfo().Name;

    switch (siteName) {
        case 'zl':
            _handler = new ZLHandler();
            break;
        case 'wy':
            _handler = new WYHandler();
            break;
        case 'lp':
            _handler = new LPHandler();
            break;
        case 'zh':
            _handler = new ZGHandler();
            break;
        case 'ec':
            _handler = new ECHandler();
            break;
        case 'tc':
            _handler = new TCHandler();
            break;
        default: throw new Error('303');
    }

    if (_handler === null) {
        throw new Error('103');
    }
    return _handler;
};

/*basic msgbox*/
var IMsgBox = function () { };

IMsgBox.prototype.MsgBox = function (settings) {
    throw new Error("must implement this method: MsgBox");
};

IMsgBox.prototype.ErrorBox = function (settings) {
    throw new Error("must implement this method: ErrorBox");
};

IMsgBox.prototype.LoadBox = function (settings) {
    throw new Error("must implement this method: LoadBox");
};

IMsgBox.prototype.TableBox = function (settings) {
    throw new Error("must implement this method: TableBox");
};

IMsgBox.prototype.InitIcon = function (iconName) {
    throw new Error("must implement this method: InitIcon");
};

IMsgBox.prototype.ChangeTitle = function (iconName) {
    throw new Error("must implement this method: ChangeTitle");
};

IMsgBox.prototype.MsgBoxLeft = function (iconName) {
    throw new Error("must implement this method: MsgBoxLeft");
};

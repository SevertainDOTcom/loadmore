/*
* Developed by Severtain @ Library LoadMore v1.0.1
* All rights reserved
*/

(function () {
    var elem, options, that, i, eventClickListener, _isUpdate = true;
    /*
    * e - dom-element container, to upload items
    * o - options
    */
    function loadMoreClass (e, o) {
        elem = e;
        options = o;
        that = this;

        if (typeof options !== "object" || options === null) {
            console.warn("Abort loadMore initialization: where is options?!");
            die();
            return;
        }

        _init();
    }
    /*
    * Protected method initialization
    */
    function _init() {
        var arr_options_scope = {
            require: ["ajaxUrl", "domButtonUpload"],
            variable: ["uploadIcon", "ajaxType", "filters", "inversion", "eventAnswer" , "eventPrevSend", "eventAfterSend", "eventError", "hideButtonUpload"]
        };

        //Insert options value in object memory
        for (var j in arr_options_scope)
            for (i in arr_options_scope[j]) {
                var val = arr_options_scope[j][i];

                if (options[val]===undefined) {
                    if (j=="require") {
                        console.warn("Abort loadMore initialization: not available property: "+val);
                        die();
                        return;
                    }
                } else
                    that[val] = options[val];
            }

        _connectHandlers();
    }

    function _connectHandlers() {
        function f () {
            if ($(that.domButtonUpload).attr("disabled"))
                return false;

            that.upload();

            return false;
        }

        eventClickListener = $(document.body).on("click", that.domButtonUpload, f);
    }

    function _removeHandlers() {
        eventClickListener.off();
    }

    /*
    * Clear class and handlers
    */
    function _removeClass() {
        _removeHandlers();

        delete that;
    }

    function die () {
        delete that;
    }
    /*
    * Class prototype
    */
    loadMoreClass.prototype = {
        ajaxUrl: "",
        ajaxType: "POST",
        domButtonUpload: null,
        uploadIcon: null,
        filters: null,
        inversion: false,
        hideButtonUpload: true,
        eventAnswer: function () {},
        eventPrevSend: function () {},
        eventAfterSend: function () {},
        eventError: function (e) {},
        _counter: 1,
        _isUpdate: true,
        reloadContainer: function () {
            that._isUpdate = true;
            that._counter = 0;
            $(elem).html("");

            $(that.domButtonUpload).show();
            $(that.domButtonUpload).removeAttr("disabled");

            that.upload();
        },
        changeFilterSettings: function (settings) {
            that.filters = settings;
        },
        upload: function () {
            if (!$(elem).parent()) {
                console.warn("You remove element from page!");
                _removeClass();
                return;
            }

            if (that._isUpdate) {
                that.eventPrevSend();
                if (that.hideButtonUpload) $(that.domButtonUpload).hide();
                $(that.domButtonUpload).attr("disabled", "true");
                if (that.uploadIcon) $(that.uploadIcon).show();

                //Create ajax data
                var sendData = {counter: that._counter};
                for (i in that.filters)
                    sendData[i] = that.filters[i];

                $.ajax({
                    method: that.ajaxType,
                    url: that.ajaxUrl,
                    data: sendData,
                    success: function (answer) {
                        var text = answer;
                        answer = text.replace(/\r|\n/g, '<br>');

                        try { //проверка на парсинг ответа
                            var data = JSON.parse(answer);
                        } catch (e) {
                            console.warn('Failed parse answer: ' + e);
                            _isUpdate = false;
                            that.eventError(e);
                            return;
                        }
                        text = $("<div />").html(data['render']).text();

                        if (!that.inversion)
                            $(elem).append(text);
                        else
                            $(elem).children(":first").before(text);

                        //Next page
                        that._counter++;

                        if (!data['more'] || data['more'] == 'false') {
                            if (that.hideButtonUpload) $(that.domButtonUpload).hide();
                        }
                        else {
                            if (that.hideButtonUpload) $(that.domButtonUpload).show();
                            $(that.domButtonUpload).removeAttr("disabled");
                        }

                        if (that.uploadIcon) $(that.uploadIcon).hide();

                        that.eventAfterSend();
                    }
                });
            }
        }
    };

    window.loadMore = loadMoreClass;
})();
# LoadMore (lazy container script) [jQuery]

## Usage

After you connect lib file, call loadMore constructor.
Example:

```javascript
var lazyContainer = new loadMore($("#data_container"), {
    ajaxUrl:  "/ajax-lazy-container",
    domButtonUpload: $("#load_button")
});
```

You can add more settings to you init function:

```javascript
($("#data_container"), {
    //require
    ajaxUrl:  "/ajax-lazy-container",
    domButtonUpload: $("#load_button")
    //situative
    uploadIcon: .. ,
    ajaxType: .. ,
    filters: { ... },
    inversion: boolean,
    eventAnswer: () => {..},
    eventPrevSend: () => {..},
    eventAfterSend: () => {..},
    eventError: () => {..}
});
```
## Backend

Get POST or GET properties on you server function. Yii2Example:

```php
counter = Yii::$app->request->post('counter'); //auto script counter
```
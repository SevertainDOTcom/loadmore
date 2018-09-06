# LoadMore (lazy container script) [jQuery]

## Usage

After you connect lib file, call loadMore constructor.
Example

```javascript
var lazyContainer = new loadMore($("#data_container"), {
    ajaxUrl:  "/ajax-lazy-container",
    domButtonUpload: $("#load_button"),
    uploadIcon: $("#upload_gif")
});
```
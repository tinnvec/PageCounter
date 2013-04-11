// Global Variables
var allDocumentPages = new Array();

(function($) {
    $(document).ready(function() {
        $('#btn_reset').click(function() {
            allDocumentPages = new Array();
            $('#documents_processed').html("");
            $('#pages_printed').html("");
        });
        
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great, all the file APIs supported
            // Apply our own actions to dragover
            $('#drop_zone').bind('dragover', function (e) {
                e.stopPropagation();
                e.preventDefault();
                e.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show as copy
            });

            // And to drop
            $('#drop_zone').bind('drop', function (e) {
                e.stopPropagation();
                e.preventDefault();

                var files = e.originalEvent.dataTransfer.files; // FileList object

                $.each(files, function() {
                    var reader = new FileReader();
                    var documentPages = new Array();

                    reader.readAsText(this);
                    reader.onload = (function (f) {
                        return function (evt) {
                            $.each(evt.target.result.split('\n'), function () {
                                if (this != "" && this != null ) {
                                    tempArray = this.split('|');
                                    documentPages.push(tempArray[1]);
                                }
                            });
                        };
                    })(this);

                    reader.onloadend = function () {
                        var twoSidedPages = 0;
                        var oneSidedPages = 0;

                        $.each(documentPages, function () {
                            allDocumentPages.push(parseInt(this));
                        });

                        $.each(allDocumentPages, function () {
                            var currentNumberOfPages = parseInt(this);
                            twoSidedPages += parseInt(currentNumberOfPages / 2);
                            oneSidedPages += currentNumberOfPages % 2;
                        });

                        $('#documents_processed').html(allDocumentPages.length + " documents processed");
                        $('#pages_printed').html(twoSidedPages + " double sided pages, " + oneSidedPages + " single sided pages");
                    };
                });
            });
        } else {
            // Uh oh, no file APIs supported
            alert('The file APIs are not fully supported in this browser.');
        }
    });
})(jQuery)
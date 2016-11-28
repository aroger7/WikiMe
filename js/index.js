var searchAnimLen = 600;
var searchActive = false;

$("document").ready(function () {
    marginVal = $("#search-box").css("margin-top");
    $("#search-icon").click(function () {
        if (isSearchStringValid()) {
            search();
        }
    });
    
    $("#random-article-icon").click(function() {
        window.open("https://en.wikipedia.org/wiki/Special:Random", "_blank");
    })

    $("#search-text-box").keyup(function () {
        if (event.which == 13 && isSearchStringValid()) {
            search();
        }
    });

    $("#close-icon").click(function () {
        $("#result-box").fadeOut(400, function () {
            $("#search-box").css("margin", "auto");
            var marginTopVal = $("#search-box").css("margin-top");           
            $("#search-box").css("margin-top", "10px");
            $("#title").css("display", "block");
            $("#title").animate({
                opacity: 1,
                height: $("#title").css("font-size")
            }, searchAnimLen);
            $("#search-box").animate({
                marginTop: marginVal
            }, searchAnimLen);
            $("#close-icon").animate({
                opacity: 0
            }, searchAnimLen / 2, function () {
                $("#close-icon").css("display", "none");
                $("#search-icon").css("display", "initial");
                $("#search-icon").animate({
                    opacity: 1
                }, searchAnimLen / 2);
            });

            searchActive = false;
        });
    });
});

function isSearchStringValid() {
    var searchString = $("#search-text-box").val();
    return searchString ? true : false;
}

function search() {
    $("#result-spinner").css("display", "initial");
    $("#result-list").html("");
    $("#no-result-text").css("display", "none");

    if (!searchActive) {
        $("#result-box").css("display", "none");
        $("#title").animate({
            opacity: 0,
            height: 0
        }, searchAnimLen, function () {
            $("#title").css("display", "none");
        });

        $("#search-icon").animate({
            opacity: 0
        }, searchAnimLen / 2, function () {
            $("#search-icon").css("display", "none");
            $("#close-icon").css("display", "initial");
            $("#close-icon").animate({
                opacity: 1
            }, searchAnimLen / 2);
        });

        $("#search-box").animate({
            marginTop: 10,
            marginBottom: 0
        }, searchAnimLen, function () {
            $("#result-box").css("display", "flex");
            $("#result-list").css("display", "initial");
            $("#result-spinner").css("display", "initial");
        });

        searchActive = true;
    }


    $(":animated").promise().done(function () {
        var url = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&limit=30&search=" + $("#search-text-box").val() + "&callback=?";
        $.getJSON(url, function (json) {
            $("#result-spinner").css("display", "none");
            updateResults(json);
        });
    });
}

function updateResults(json) {
    if (json[1].length > 0) {
        for (var i = 0; i < json[1].length; i++) {
            var listItemHtml = "<li><a class=\"result-link\" target=\"_blank\" href=\"" +
                json[3][i] + 
                "\"><h2 class=\"result-title\">" + 
                json[1][i] + 
                "</h2><p class=\"result-description\">" + 
                json[2][i] + 
                "</p></a></li>";
            $("#result-list").append(listItemHtml);
        }
    } else {
        $("#no-result-text").css("display", "initial");
    }
}
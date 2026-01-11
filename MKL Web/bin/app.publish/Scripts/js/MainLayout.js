// --------------------------
// Global Functions
// --------------------------

function logout() {
    Swal.fire({
        title: 'Logout Confirmation',
        text: "Are you sure you want to logout?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, Logout',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/log/log';
        }
    });
}

function checkUser() {
    $.ajax({
        url: '/getData/checkUser',
        type: 'POST',
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status == "Expired") {
               /* var baseUrl = "@Url.Action('log', 'log')";*/
                /*window.location.href = baseUrl;*/
                window.location.href = '/log/log';
            }
        },
        error: function (error) {
            alert('Error while reading data => ' + error);
        }
    });
}

function showMenuSuggestions(query) {
    query = query.trim().toLowerCase();
    const resultsContainer = $("#menuSearchResults");
    const hrefPreview = $("#menuHrefPreview");
    resultsContainer.empty().hide();
    hrefPreview.text("");

    if (query === '') return;

    let matches = [];

    $(".sidebar-menu li a").each(function () {
        const href = $(this).attr("href") || "";

        // Skip non-functional links and headers
        if (!href || href === "#" || href.trim() === "") return;
        if ($(this).closest('li.header').length > 0) return;

        const text = $(this).text().trim();

        if (text.toLowerCase().includes(query)) {
            matches.push({ text: text, href: href, element: this });
        }
    });

    if (matches.length > 0) {
        matches.forEach(item => {
            const listItem = $("<li class='list-group-item' style='cursor:pointer; padding:6px 10px;' title='" + item.href + "'>")
                .text(item.text)
                .on("click", function () {
                    window.location.href = item.href;
                })
                .on("mouseenter", function () {
                    hrefPreview.text("URL: " + item.href);
                    $(".sidebar-menu li a.highlight-hover").removeClass("highlight-hover");
                    $(item.element).addClass("highlight-hover");

                    const sidebar = $(".sidebar");
                    if (sidebar.length) {
                        const sidebarTop = sidebar.offset().top;
                        const linkTop = $(item.element).offset().top;
                        const scrollPos = sidebar.scrollTop();
                        const offset = linkTop - sidebarTop + scrollPos - 60;
                        sidebar.animate({ scrollTop: offset }, 300);
                    }
                })
                .on("mouseleave", function () {
                    hrefPreview.text("");
                    $(item.element).removeClass("highlight-hover");
                });

            resultsContainer.append(listItem);
        });

        resultsContainer.show();
    }
}



let interval;

function resetSessionTimer() {
    clearInterval(interval);
    let countdown = 8 * 60;
    const $timer = $('.timer');
    $timer.text(countdown);
    interval = setInterval(function () {
        $timer.text(--countdown);
        if (countdown === 0) {
            window.location.href = '/log/log';
        }
    }, 1000);
}

$(document).on('mousemove keydown', function () {
    resetSessionTimer();
}).trigger('mousemove');

// --------------------------
// Click Outside Menu Suggestion
// --------------------------

$(document).on("click", function (e) {
    if (!$(e.target).closest("#menuSearchBox, #menuSearchResults").length) {
        $("#menuSearchResults").hide();
        $("#menuHrefPreview").text("");
        $(".sidebar-menu li a.highlight-hover").removeClass("highlight-hover");
    }
});

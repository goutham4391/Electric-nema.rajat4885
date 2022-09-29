/*
 * Copyright (c) Dominick Baier, Brock Allen.  All rights reserved.
 * see license
 */
var showError;
function checkApprovalError(useremail, errorMessage) {
    var data = { email: useremail };
    $.ajax({
        url: '/LoginCustom/GetApprovalStatus',
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data === 'not approved') {
                $(".alert").html("<strong>Error:</strong> Your email is not verified yet. Please check your inbox for the verification email, try again or <a href='/about/contact'>Contact Us</a>.");
            }
            else {
                $(".alert").html("<strong>Error:</strong> " + errorMessage);
            }
        }
    });
}

window.identityServer = (function () {
    "use strict";

    var identityServer = {
        getModel: function () {
            var modelJson = document.getElementById("modelJson");
            var encodedJson = '';
            if (typeof (modelJson.textContent) !== undefined) {
                encodedJson = modelJson.textContent;
            } else {
                encodedJson = modelJson.innerHTML;
            }
            var json = Encoder.htmlDecode(encodedJson);
            var model = JSON.parse(json);
            if (model.errorMessage === "Incorrect credentials") {
                showError = true;
                checkApprovalError(model.username, model.errorMessage);
            }
            return model;
        }
    };

    return identityServer;
})();

var http;

(function () {
    "use strict";
    (function () {

        var getSiteURL = function (action) {
            http.get('/LoginCustom/GetSiteURL').then(function successCallback(response) {
                var val = JSON.parse(response.data);
                action(val);
            });
        };

        var app = angular.module("app", []);

        app.controller("LayoutCtrl", ['$scope', '$http', 'Model', function ($scope, $http, Model) {
            $scope.model = Model;
            $scope.disableForm = false;
            $scope.windowsUser = false;
            $scope.showErrorMessage = false;
            $scope.showVerificationMessage = false;
            $scope.showIPMessage = false;
            $scope.showGenericMessage = false;
            $scope.showDiv = $scope.success = $scope.loginText = true;
            http = $http;
            $scope.showErrorMessage = showError;
            $scope.passwordlessLoginPage = function () {
                $scope.showDiv = !$scope.showDiv;
                $scope.model.errorMessage = '';
                $scope.model.username = '';
            };

            $scope.$watch('showDiv', function () {
                $scope.loginText = !$scope.loginText;
                $scope.loginText = $scope.showDiv ? 'Login' : 'Send Email';
                $scope.passwordlessText = $scope.showDiv ? 'Email Login Link' : 'Regular Login';
            });

            $scope.sendUserEmail = function (email, successCallback) {
                $http.post(location.origin + "/LoginCustom/SendAuthenticationEmail",
                    {
                        email: email
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function sCallback(result) {
                        var val = JSON.parse(result.data);
                        if (val === 'Success') {
                            if (successCallback) {
                                successCallback();
                            }
                        }
                        else if (val === "UnApproved") {
                            $scope.showErrorMessage = true;
                            $scope.showVerificationMessage = true;
                            $scope.disableForm = false;
                        }
                        else if (val === "InvalidIP") {
                            $scope.showErrorMessage = true;
                            $scope.showIPMessage = true;
                            $scope.disableForm = false;
                        }
                        else {
                            $scope.showErrorMessage = true;
                            $scope.showGenericMessage = true;
                            $scope.disableForm = false;
                        }
                }, function eCallback(error) {
                        $scope.showErrorMessage = true;
                        $scope.showGenericMessage = true;
                        $scope.disableForm = false;
                });
            };

            $scope.logoutRedirect = function (e) {
                setTimeout(function () {
                    getSiteURL(function (data) {
                        if (data !== '')
                            window.location.href = data;
                    });
                }, 3000);
            };
            $scope.LoginPP = function (e) {
                var nemaSite = getCookie('NEMASITE');
                if (nemaSite.toLowerCase().indexOf('medical') > 0 || nemaSite.toLowerCase().indexOf('mita') > 0) {
                    window.open(nemaSite + '/privacy-policy', '_blank');
                }
                else if (nemaSite.toLowerCase().indexOf('dicom') > 0) {
                    window.open(nemaSite + '/dicom-privacy-policy', '_blank');
                }
                else {
                    window.open(nemaSite + '/about/privacy-policy', '_blank');
                }
            };
            $scope.LoginTC = function (e) {
                var nemaSite = getCookie('NEMASITE');
                if (nemaSite.toLowerCase().indexOf('medical') > 0 || nemaSite.toLowerCase().indexOf('mita') > 0) {
                    window.open(nemaSite + '/terms-conditions', '_blank');
                }
                else if (nemaSite.toLowerCase().indexOf('dicom') > 0) {
                    window.open(nemaSite + '/dicom-terms-conditions', '_blank');
                }
                else {
                    window.open(nemaSite + '/about/terms-and-conditions', '_blank');
                }
            };
            $scope.LoginContact = function (e) {
                var nemaSite = getCookie('NEMASITE');
                if (nemaSite.toLowerCase().indexOf('medical') > 0 || nemaSite.toLowerCase().indexOf('mita') > 0) {
                    window.location = nemaSite + '/contact-us';
                }
                else if (nemaSite.toLowerCase().indexOf('dicom') > 0) {
                    window.location = nemaSite + '/contact';
                }
                else {
                    window.location = nemaSite + '/about/contact';
                }
            };
            $scope.LoginHome = function (e) {
                var nemaSite = getCookie('NEMASITE');
                window.location = nemaSite;
            };
            $scope.Login = function (e) {
                if ($scope.showDiv) {
                    $scope.windowsUser = false;
                    var domains = [
                        'nema.org',
                        'medicalimaging.org',
                        'dicomstandard.org',
                        'esfi.org'
                    ];

                    var emailParts = model.username.split('@');
                    if (emailParts.length === 2) {
                        var domain = emailParts[1].toLowerCase();
                        for (var k = 0; k < domains.length; k++) {
                            if (domains[k] === domain) {
                                $scope.windowsUser = true;
                                break;
                            }
                        }

                        if ($scope.windowsUser) {
                            e.preventDefault();
                        }
                    }
                }
                else {
                    //This is to do passwordless auth

                    if (!$scope.form.email.$valid) {
                        $scope.valid = true;
                    }
                    else {
                        // prevent reload of page
                        e.preventDefault();

                        $scope.disableForm = true;
                        $scope.sendUserEmail($scope.model.email, function () {
                            toastr.success('We sent you an email!', 'Success', { timeOut: 3000 });
                            setTimeout(function () {
                                getSiteURL(function (data) {
                                    if (data !== '')
                                        window.location.href = data + '/successmessages/email-login-success';
                                });
                            }, 3000);
                        });
                    }
                }
            };

            $scope.windowsauth = function () {
                var confighost = document.referrer.split('/')[2].split(':')[0];
                //console.log('url', document.referrer.split('/')[2].split(':')[0]);

                for (var i = 0; i < Model.externalProviders.length; i++) {
                    if (Model.externalProviders[i].type === confighost + '_windows') {
                        window.location = Model.externalProviders[i].href;
                    }
                }
            };
        }]);

        app.directive("antiForgeryToken", function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    token: "="
                },
                template: "<input type='hidden' name='{{token.name}}' value='{{token.value}}'>"
            };
        });

        app.directive("focusIf", ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    focusIf: '='
                },
                link: function (scope, elem, attrs) {
                    if (scope.focusIf) {
                        $timeout(function () {
                            elem.focus();
                        }, 100);
                    }
                }
            };
        }]);

        var model = identityServer.getModel();
        //console.log('model', model);
        app.constant("Model", model);

        var hostname = window.location.hostname;

        var prefCookie = getCookie("NemaLoginPreference");
        if (prefCookie != null && prefCookie.length > 0) {
            var searchhost = '';
            if (prefCookie === 'NEMAStaff' || prefCookie === 'nemastaff') {
                searchhost = hostname + '_windows';
            }
            else {
                searchhost = hostname;
            }

            if (typeof model.externalProviders !== undefined && model.externalProviders !== undefined
                && model.externalProviders !== null) {
                for (var i = 0; i < model.externalProviders.length; i++) {
                    if (model.externalProviders[i].type === searchhost) {
                        window.location = model.externalProviders[i].href;
                    }
                }
			}
        }
    })();

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function removeCookie(sKey, sPath, sDomain) {
        document.cookie = encodeURIComponent(sKey) +
            "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
            (sDomain ? "; domain=" + sDomain : "") +
            (sPath ? "; path=" + sPath : "");
    }

})();

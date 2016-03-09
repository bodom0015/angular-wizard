angular
.module('ngWizard', [])
.service('WizardPage', function(){
    return function(key, displayName, pageLinks, disabled) {
        var page = {};
        
        page.key = key;
        page.displayName = displayName;
        page.prevPage = pageLinks.prev;
        page.nextPage = pageLinks.next;
        page.canNextPage = angular.isFunction(pageLinks.canNext) ? pageLinks.canNext : (function() { return pageLinks.canNext; });
        page.onNextPage = pageLinks.onNext;
        
        // Disable page links by default until they have been navigated to
        if (angular.isDefined(disabled)) {
            page.disabled = disabled;
        } else {
            page.disabled = true;
        }
        
        return page;
    }
  })
.service('Wizard', [ '$interval', function($interval){
    return function(initPages, initDelay) {
        var wizard = {};
        
        // specified (or empty, if no pages were given) pages list
        wizard.pages = initPages || [];
        
        wizard.percentage = '0';
        
        wizard.success = false;
        // Bind-able state for "Next" button timer
        wizard.nextIsAllowed = true;
        wizard.currentTimer = 0;
        
        // Private members to manage our "Next" button timer
        var delay = initDelay || 0;
        var nextButtonTimeout = null;
        var startTimer = function () {
            stopTimer();
            wizard.nextIsAllowed = false;
            if (delay > 0) {
                nextButtonTimeout = $interval(function() {
                    if (wizard.currentTimer === 0) {
                        wizard.nextIsAllowed = true;
                        wizard.stopTimer();
                        return;
                    }
                    wizard.currentTimer = wizard.currentTimer - 1;
                }, 1000, wizard.currentTimer = delay);
            }
        };
        var stopTimer = function () {
            $interval.cancel(nextButtonTimeout);
            nextButtonTimeout = null;
        };
        
        // given a key or display name, return the first page that corresponds to it (if such pages any exist)
        wizard.getPageByName = function(name) {
            var ret = null;
            angular.forEach(wizard.pages, function(value) {
                if (name === value.key || name === value.displayName) {
                    ret = value;
                    return;
                }
            });
            return ret;
        };
        
        // Change to the specified page, which may either be a page name, or the page itself
        wizard.setCurrentPage = function(page) {
            if (angular.isString(page)) {
                page = wizard.getPageByName(page);
            }
            if (!page) {
                return;
            }
            wizard.currentPage = page;
            
            wizard.percentage = (wizard.pages.indexOf(wizard.currentPage) / (wizard.pages.length - 1)) * 100;
            wizard.currentPage.disabled = false;
        };
        
        // Define next / back button functionality here
        wizard.canPrevPage = function() { 
            return wizard.currentPage.prevPage != null; 
        };
        wizard.canNextPage = function() {
            return wizard.currentPage.nextPage != null && wizard.currentPage.canNextPage();
        };
        wizard.prevPage = function() {
            wizard.setCurrentPage(wizard.currentPage.prevPage);
        };
        wizard.nextPage = function() {
            var onNextPage = wizard.currentPage.onNextPage;
            if (onNextPage && angular.isFunction(onNextPage)) {
                onNextPage();
            }

            if (angular.isFunction(wizard.currentPage.nextPage) {
                wizard.setCurrentPage(wizard.currentPage.nextPage());
            } else { 
                wizard.setCurrentPage(wizard.currentPage.nextPage);
            }

            startTimer();
        };
        
        // the current page that we are on (initialized to the start page)
        angular.forEach(wizard.pages, function (value) {
            if (value.prevPage === null) {
                // We have found our initial wizard page!
                wizard.currentPage = value;
            }
        });
        
        return wizard;
    }
  }]);

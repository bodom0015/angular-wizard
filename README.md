## Synopsis

This is a primitive wizard service for AngularJS

[Live Demo!](http://bodom0015.game-server.cc/bower_components/angular-wizard/demo.html)

## Motivation
Wizards are a part of many management UIs, so I thought it would be useful to create a reusable service to handle the paging-type logic contained inherent in wizard design.

NOTE: Bootstrap is not necessary to use this wizard, I have simply used it below in the example to display the wizard.

## Installation
Bower integration possibly in the future.

Until then, running the following command should retrieve a copy of the source code:
```git
git clone https://github.com/bodom0015/angular-wizard.git
```

The source code includes a `demo.html` page which illustrates the usage of this module.

To use the module, add a reference to the javascript to your `index.html`:
```html
<script src="angular-wizard/angular-wizard.js"></script>
```

## Usage
    
Add the `ngWizard` module to your module's instantiation and pass the Wizard and WizardPage services into your Controller:
```js
angular
.module('wizardTest', [ 'ngWizard' ])
.controller('WizardController', [ '$scope', 'Wizard', 'WizardPage', function($scope, Wizard, WizardPage) {
  var wizardPages = [
     new WizardPage("first", "First Page", {
        prev: null,
        canPrev: true,
        canNext: true,
        next: 'second'
     }, false),
  
     new WizardPage("second", "Second Page", {
        prev: 'first',
        canPrev: true,
        canNext: true,
        next: 'third'
     }, true),
     new WizardPage("third", "Third Page", {
        prev: 'second',
        canPrev: true,
        canNext: true,
        next: null
     }, true),
  ];
  
  // The delay (in seconds) before allowing the user to click "Next"
  var initDelay = 0;
  
  // Create a new Wizard to display
  $scope.wizard = new Wizard(wizardPages, initDelay);
    
  // You can wrap this in a function to clear the wizard state between uses
  $scope.resetWizard = function() {
    $scope.wizard = new Wizard(wizardPages, initDelay);
  }
}]);
```

You should then be able to bind to this wizard in the view template:
```html
<div ng-view ng-controller="WizardController" class="container">
  <div class="row">
    <div class="col-md-12">
      <h1>ngWizard Demo Page</h1>
      
      <!-- Button trigger modal -->
      <button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#wizardModal" ng-click="resetWizard()">
        Launch demo wizard
      </button>
      
      <pre>{{ wizard | json }}</pre>

      <!-- Wizard Popup (Modal) -->
      <div class="modal fade" id="wizardModal" tabindex="-1" role="dialog" aria-labelledby="wizardModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="wizardModalLabel">Wizard Demo!</h4>
            </div>
            <div class="modal-body">
              <div class="row">
                    <!-- Wizard Page selector --> 
                    <div class="col-md-12">
                        <!-- Navigation here (work in progress) -->
                        <!--<ul class="nav nav-pills nav-justified">
                          <li role="presentation" ng-repeat="page in wizard.pages" ng-class="{ 'active': wizard.currentPage.key === page.key }">
                            <button class="btn btn-link" ng-disabled="page.disabled" ng-click="wizard.setCurrentPage(page)">{{ page.displayName }}</button>
                          </li>
                        </ul>-->
                        
                        <!-- Wizard progress bar here -->
                        <div class="progress">
                          <div class="progress-bar" role="progressbar" aria-valuenow="{{ wizard.percentage }}" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: {{ wizard.percentage }}%;">
                            {{ wizard.percentage }}%
                          </div>
                        </div>
                        
                        <!-- Wizard Pages shown here -->
                        <div style="padding:10px;">
                            <div ng-if="wizard.currentPage.key === 'first'">
                              <p>This is the first page of the wizard!</p>
                              <p>You can use this page to introduce the user to the process that you will then step them through.</p>
                            </div>
                            <div ng-if="wizard.currentPage.key === 'second'">
                              <p>This is the second page of the wizard!</p>
                              <p>You can use this page to collect data about the operation that you about to perform.</p>
                              <p><label>NOTE:</label> Make sure to get the user's confirmation before changing any of their data.</p>
                            </div>
                            <div ng-show="wizard.currentPage.key === 'third'">
                              <p>This is the final page of the wizard!</p>
                              <p>This is where you can notify the user about the success (or failure) of the requested operation.</p>
                              <p><label>NOTE:</label> In the case of failure, you may wish to provide the user with a method of going back to adjust their input.</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Wizard Back / Next buttons here -->
                </div>
            </div>
            <div class="modal-footer">
              <div ng-if="wizard.canNextPage()">
                <!-- "Cancel" button (close modal with success === false) -->
                <button class="btn btn-link pull-left" ng-if="wizard.canNextPage()" data-dismiss="modal" aria-label="Close"><i class="fa fa-arrow-circle-o-left"></i>&nbsp;&nbsp;Cancel</button>
                
                <!-- Previous Page -->
                <button class="btn btn-primary" ng-disabled="!wizard.canPrevPage()" ng-click="wizard.prevPage()"><i class="fa fa-arrow-circle-left"></i>&nbsp;&nbsp;Back</button>
                
                <!-- Next Page -->
                <button class="btn btn-primary" ng-disabled="wizard.currentTimer > 0 || !wizard.canNextPage()" ng-click="wizard.nextPage()">
                    Next&nbsp;<span ng-show="wizard.currentTimer > 0">({{ wizard.currentTimer }})</span>&nbsp;
                        <i ng-show="wizard.currentTimer === 0" class="fa fa-arrow-circle-right"></i>
                        <i ng-show="wizard.currentTimer > 0" class='fa fa-spinner fa-spin'></i>
                </button>
              </div>
              <div ng-if="wizard.currentPage.nextPage === null">
                <!-- "Finish" button (close modal with success === true) -->
                <button class="btn btn-primary" ng-disabled="!wizard.canPrevPage()" data-dismiss="modal" aria-label="Close" ng-click="wizard.success = true"><i class="fa fa-check-circle"></i>&nbsp;&nbsp;Finish</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

## License

MIT
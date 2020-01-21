'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">portal-template documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/NAPConnectionModel.html" data-type="entity-link">NAPConnectionModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/NAPDataStore.html" data-type="entity-link">NAPDataStore</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/NAPAuthService.html" data-type="entity-link">NAPAuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NAPConnectionService.html" data-type="entity-link">NAPConnectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NAPStoreService.html" data-type="entity-link">NAPStoreService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/NAPAggregateOptions.html" data-type="entity-link">NAPAggregateOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NapAggregation.html" data-type="entity-link">NapAggregation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NAPDeleteOptions.html" data-type="entity-link">NAPDeleteOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NAPGroupOption.html" data-type="entity-link">NAPGroupOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NAPInsertOptions.html" data-type="entity-link">NAPInsertOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NAPListOptions.html" data-type="entity-link">NAPListOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NAPLoginIdentities.html" data-type="entity-link">NAPLoginIdentities</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NAPLoginOptions.html" data-type="entity-link">NAPLoginOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NAPMiddlewaresProfiles.html" data-type="entity-link">NAPMiddlewaresProfiles</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NAPPayloadI.html" data-type="entity-link">NAPPayloadI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NAPProjectionOption.html" data-type="entity-link">NAPProjectionOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NAPReadOptions.html" data-type="entity-link">NAPReadOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NapResAllowedReadI.html" data-type="entity-link">NapResAllowedReadI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NapResAllowedWriteI.html" data-type="entity-link">NapResAllowedWriteI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NAPResetPasswordOptions.html" data-type="entity-link">NAPResetPasswordOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NapResOperationsAllowedI.html" data-type="entity-link">NapResOperationsAllowedI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NapResourcesAllowedI.html" data-type="entity-link">NapResourcesAllowedI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NapResponse.html" data-type="entity-link">NapResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NAPSortOption.html" data-type="entity-link">NAPSortOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NAPUpdateOptions.html" data-type="entity-link">NAPUpdateOptions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
import { AuthenticationService } from './../../admin/services/authentication.service';
import { MenuVisibiltyService } from '../services/role-menu.service';
import { Component, Input, OnInit, EventEmitter, ViewChild, Inject, forwardRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';
import { MainLayoutComponent } from '../layout/mainlayout.component';
import * as _ from 'lodash';
import { DashboardService } from 'app/dashboard/dashboard.service';


@Component({
    selector: 'app-menu',
    template: `
        <ul app-submenu [item]="model" root="true" class="ultima-menu ultima-main-menu clearfix" [reset]="reset" visible="true"></ul>
    `
})
export class AppMenuComponent implements OnInit {

    @Input() reset: boolean;

    model: MenuItem[];
    userInfo: any;
    currCode: any;


    constructor(@Inject(forwardRef(() => MainLayoutComponent)) public app: MainLayoutComponent,
        private authService: AuthenticationService,
        private dashboard: DashboardService,
        private menuGuardSrv: MenuVisibiltyService) { }


    ngOnInit() {
        this.getCountryCurrency();
        this.model = [
            {
                label: this.menuGuardSrv.translate('Dashboard'), icon: 'equalizer', routerLink: ['/'],
                // visible: this.menuGuardSrv.hideOrShow(['dashboard'])
            },
            
            {
                label: this.menuGuardSrv.translate('Admin'), icon: 'business',
                visible: this.menuGuardSrv.hideOrShow([
                    'eod process',
                    'api log',
                    'app error log',
                    'custom batch posting',
                    'user group', 
                    'group activity',
                    'staff registration',
                    'user registration',
                    'signature management',
                    'user account management',
                    'user-role setup',
                    'profile-settings',
                    'collateral type setup',
                    'collateral sub-type setup',
                    'accredited consultants',
                    'approved employers setup',
                    'approved fts markets setup',
                    'limit maintenance',
                    'email alert setup',
                    'document repository setup',
                    'checklist definition setup',
                    'default conditions setup',
                    'transaction dynamics setup',
                    'compliance timeline setup',
                    'covenant types setup',
                    'prudential guidelines setup',
                    'fs caption-group',
                    'fs caption',
                    'fs ratio-caption',
                    'fs ratio-detail',
                    'tat setup',
                    'call limit setup',
                    'job request setup',
                    'group relationship type',
                    'customer group',
                    'group caption-detail',
                    'approval group',
                    'approval level',
                    'approval workflow',
                    'approval relief',
                    'company setup',
                    'region setup',
                    'branch setup',
                    'department setup',
                    'unit setup',
                    'state setup',
                    'city setup',
                    'tax setup',
                    'fee and charge setup',
                    'product process setup',
                    'product class setup',
                    'product group setup',
                    'product type setup',
                    'product definition setup',
                    'product maintenance setup',
                    'ledger account type',
                    'chart of account',
                    //'approval trail',
                    'dormant staff log',
                    'deleted staff log',
                    'bulk disbursement',
                    //'alert setup',
                    'document upload setup',
                    'document mapping setup',
                    'job hub management'
                ]),
                items: [
                    {
                        label: this.menuGuardSrv.translate('IT Admin'), icon: '',
                        visible: this.menuGuardSrv.hideOrShow([
                            'eod process',
                            'api log',
                            'app error log',
                            'custom batch posting',
                            //'approval trail',
                            'dormant staff log',
                            'deleted staff log',
                            //'alert setup',
                            'document upload setup'
                            //'data archive',
                            // 'manual data archive'
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('EOD Process'), icon: '', routerLink: ['/setup/end-of-day'],
                                visible: this.menuGuardSrv.hideOrShow(['eod process'])
                            },
                            {
                                label: this.menuGuardSrv.translate('API Log'), icon: '', routerLink: ['/admin/api-log'],
                                visible: this.menuGuardSrv.hideOrShow(['api log'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Application Error Log'), icon: '', routerLink: ['/admin/error-log'],
                                visible: this.menuGuardSrv.hideOrShow(['app error log'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Deleted Staff Log'), icon: '', routerLink: ['/admin/deleted-staff-log'],
                                visible: this.menuGuardSrv.hideOrShow(['deleted staff log'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Dormant Staff Log'), icon: '', routerLink: ['/admin/dormant-staff-log'],
                                visible: this.menuGuardSrv.hideOrShow(['dormant staff log'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Alert Setup'), icon: '', routerLink: ['/setup/alert-setup'],
                                visible: this.menuGuardSrv.hideOrShow(['document upload setup'])
                            },
                            // {
                            //     label: this.menuGuardSrv.translate('Data Archive'), icon: '', routerLink: ['/setup/data-archive'],
                            //     visible: this.menuGuardSrv.hideOrShow(['data archive'])
                            // },
                            // {
                            //     label: this.menuGuardSrv.translate('Manual Data Archive'), icon: '', routerLink: ['/setup/manual-data-archive'],
                            //     visible: this.menuGuardSrv.hideOrShow(['manual data archive'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Custom Batch Posting'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow(['custom batch posting']),
                                items: [
                                    {
                                        label: this.menuGuardSrv.translate('Detail'), icon: '', routerLink: ['/admin/batch-posting-detail'],
                                        visible: this.menuGuardSrv.hideOrShow(['custom batch posting'])
                                    },
                                    
                                    {
                                        label: this.menuGuardSrv.translate('Main'), icon: '', routerLink: ['/admin/batch-posting-main'],
                                        visible: this.menuGuardSrv.hideOrShow(['custom batch posting'])
                                    },
                                    // {
                                    //     label: this.menuGuardSrv.translate('Refresh Staging Monitoring'), icon: '', routerLink: ['/admin/refresh-staging-monitoring'],
                                    //     visible: this.menuGuardSrv.hideOrShow(['custom batch posting'])
                                    // },
                                    {
                                        label: this.menuGuardSrv.translate('Refresh Staging Monitoring'), icon: '', routerLink: ['/admin/refresh-staging-monitoring'],
                                        visible: this.menuGuardSrv.hideOrShow(['custom batch posting'])
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        label: this.menuGuardSrv.translate('User Admin'), icon: '',
                        visible: this.menuGuardSrv.hideOrShow([
                            'user group',
                            'group activity',
                            'staff registration',
                            'user registration',
                            'signature management',
                            'user account management',
                            'user-role setup',
                            'profile-settings',
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('Groups'), icon: '', routerLink: ['/admin/groups'],
                                visible: this.menuGuardSrv.hideOrShow(['user group'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Group Activity'), icon: '', routerLink: ['/admin/group-activity'],
                                visible: this.menuGuardSrv.hideOrShow(['group activity'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Users'), icon: '', routerLink: ['/admin/staff'],
                                visible: this.menuGuardSrv.hideOrShow(['staff registration'])
                            },

                            // {
                            //     label: this.menuGuardSrv.translate('Users'), icon: '', routerLink: ['/admin/users'],
                            //     visible: this.menuGuardSrv.hideOrShow(['user registration'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('User Role'), icon: '', routerLink: ['/setup/staff-role'],
                                visible: this.menuGuardSrv.hideOrShow(['user-role setup'])
                            },

                            {
                                label: this.menuGuardSrv.translate('Credit Officer Risk Rating'), icon: '', routerLink: ['/admin/officer-risk-rating'],
                                visible: this.menuGuardSrv.hideOrShow(['user account management'])
                            },

                            // {
                            //     label: this.menuGuardSrv.translate('Signature Management'), icon: '', routerLink: ['/admin/staff/signature-management'],
                            //     visible: this.menuGuardSrv.hideOrShow(['signature management'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('User Account Management'), icon: '', routerLink: ['/admin/useradministration'],
                                visible: this.menuGuardSrv.hideOrShow(['user account management'])
                            },
                            // {
                            //     label: this.menuGuardSrv.translate('Staff/Supervisor Reporting'), icon: '', routerLink: ['/setup/staff-supervisor-reporting'],
                            //     visible: this.menuGuardSrv.hideOrShow(['staff registration'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Profile Settings'), icon: '', routerLink: ['/admin/profile-settings'],
                                visible: this.menuGuardSrv.hideOrShow(['profile-settings'])
                            },
                            
                            // {
                            //     label: this.menuGuardSrv.translate('Staff/User Admin'), icon: '',
                            //     visible: this.menuGuardSrv.hideOrShow([
                            //         'user group',
                            //         'group activity',
                            //         'staff registration',
                            //         'user registration',
                            //         'signature management',
                            //         'user account management',
                            //         'user-role setup',
                            //     ]),
                            //     items: [

                            //     ]
                            // },
                        ]
                    },
                    {
                        label: this.menuGuardSrv.translate('Credit Admin'), icon: '',
                        visible: this.menuGuardSrv.hideOrShow([
                            'collateral type setup',
                            'collateral sub-type setup',
                            'accredited consultants',
                            'approved employers setup',
                            'approved fts markets setup',
                            'limit maintenance',
                            'email alert setup',
                            'document repository setup',
                            'checklist definition setup',
                            'default conditions setup',
                            'transaction dynamics setup',
                            'compliance timeline setup',
                            'covenant types setup',
                            'prudential guidelines setup',
                            'fs caption-group',
                            'fs caption',
                            'fs ratio-caption',
                            'fs ratio-detail',
                            'tat setup',
                            'call limit setup',
                            'job request setup',
                            'group relationship type',
                            'customer group',
                            'group caption-detail',
                            'approval group',
                            'approval level',
                            'approval workflow',
                            'approval relief',
                            'company setup',
                            'region setup',
                            'branch setup',
                            'department setup',
                            'unit setup',
                            'state setup',
                            'city setup',
                            'job hub management',
                            'retail collection cron job',
                           
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('Credit'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow([
                                    'collateral type setup',
                                    'collateral sub-type setup',
                                    'accredited consultants',
                                    'approved employers setup',
                                    'approved fts markets setup',
                                    'limit maintenance',
                                    'email alert setup',
                                    'document repository setup',
                                    'checklist definition setup',
                                    'default conditions setup',
                                    'transaction dynamics setup',
                                    'compliance timeline setup',
                                    'covenant types setup',
                                    'prudential guidelines setup',
                                    'fs caption-group',
                                    'fs caption',
                                    'fs ratio-caption',
                                    'fs ratio-detail',
                                    'tat setup',
                                    'call limit setup',
                                    'job request setup',
                                    'document upload-setup',
                                    'authoried signatories',
                                    'insurance setup',
                                    'job hub management',
                                    'approval setup',
                                    'retail collection cron job',

                                ]),
                                items: [
                                    {
                                        label: this.menuGuardSrv.translate('Collateral'), icon: '',
                                        visible: this.menuGuardSrv.hideOrShow(['collateral type setup', 'collateral sub-type setup']),
                                        items: [
                                            {
                                                label: this.menuGuardSrv.translate('Types'), icon: '', routerLink: ['/setup/collateral/collateral-type'],
                                                visible: this.menuGuardSrv.hideOrShow(['collateral type setup'])
                                            },
                                            {
                                                label: this.menuGuardSrv.translate('Sub-Types'), icon: '', routerLink: ['/setup/collateral/collateral-sub-type'],
                                                visible: this.menuGuardSrv.hideOrShow(['collateral sub-type setup'])
                                            },
                                        ],
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Accredited Consultants'), icon: '', routerLink: ['/setup/accredited-solicitors'],
                                        visible: this.menuGuardSrv.hideOrShow(['accredited consultants'])
                                    },
                                    
                                    {
                                        label: this.menuGuardSrv.translate('Accredited Principals'), icon: '', routerLink: ['/setup/accredited-principals'],
                                        visible: this.menuGuardSrv.hideOrShow(['accredited consultants'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Approved Employers'), icon: '', routerLink: ['/setup/setup/employer-setup'],
                                        visible: this.menuGuardSrv.hideOrShow(['approved employers setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Approved FTS Markets'), icon: '', routerLink: ['/setup/credit/approved-market'],
                                        visible: this.menuGuardSrv.hideOrShow(['approved fts markets setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Limit Maintenance'), icon: '', routerLink: ['/setup/limitmaintenance'],
                                        visible: this.menuGuardSrv.hideOrShow(['limit maintenance'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Email Alert'), icon: '', routerLink: ['/setup/alertMessages'],
                                        visible: this.menuGuardSrv.hideOrShow(['email alert setup'])
                                    },
                                    // {
                                    //     label: this.menuGuardSrv.translate('Document Repository'), icon: '', routerLink: ['/setup/document/document-template'],
                                    //     visible: this.menuGuardSrv.hideOrShow(['document repository setup'])
                                    // },
                                    {
                                        label: this.menuGuardSrv.translate('Document Template'), icon: '', routerLink: ['/setup/document/document-template-setup'],
                                        visible: this.menuGuardSrv.hideOrShow(['document template setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Document Upload Setup'), icon: '', routerLink: ['/setup/document/upload-setup'],
                                        visible: this.menuGuardSrv.hideOrShow(['document upload setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Reference Document'), icon: '', routerLink: ['/setup/reference-document'],
                                        visible: this.menuGuardSrv.hideOrShow(['document template setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Checklist Definition'), icon: '', routerLink: ['/setup/credit/checklist-definition'],
                                        visible: this.menuGuardSrv.hideOrShow(['checklist definition setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('ESG Checklist Definition'), icon: '', routerLink: ['/setup/credit/esg-checklist-definition'],
                                        visible: this.menuGuardSrv.hideOrShow(['checklist definition setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Green Loan Identifier Definition'), icon: '', routerLink: ['/setup/credit/green-rating-definition'],
                                        visible: this.menuGuardSrv.hideOrShow(['checklist definition setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('RAC'), icon: '', routerLink: ['/setup/credit/rac'],
                                        visible: this.menuGuardSrv.hideOrShow(['checklist definition setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Project Criteria'), icon: '', routerLink: ['/setup/credit/contractor-criteria-setup'],
                                        visible: this.menuGuardSrv.hideOrShow(['checklist definition setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Collection Cron Setup'), icon: '', routerLink: ['/setup/credit/collections-retail-cron-setup'],
                                        visible: this.menuGuardSrv.hideOrShow(['retail collection cron job'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Compliance Timeline'), icon: '', routerLink: ['/setup/credit/compliance-timeline'],
                                        visible: this.menuGuardSrv.hideOrShow(['compliance timeline setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Default Conditions'), icon: '', routerLink: ['/setup/credit/condition-precedent'],
                                        visible: this.menuGuardSrv.hideOrShow(['default conditions setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Default Transaction Dynamics'), icon: '', routerLink: ['/setup/credit/transaction-dynamics'],
                                        visible: this.menuGuardSrv.hideOrShow(['transaction dynamics setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Covenant Types'), icon: '', routerLink: ['/setup/credit/covenant-type'],
                                        visible: this.menuGuardSrv.hideOrShow(['covenant types setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Prudential Guidelines'), icon: '', routerLink: ['/setup/credit/prudential-guideline-setup'],
                                        visible: this.menuGuardSrv.hideOrShow(['prudential guidelines setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Authorised-Signatories'), icon: '', routerLink: ['/setup/signatory/signatory-setup'],
                                        visible: this.menuGuardSrv.hideOrShow(['Authorised Signatories'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Insurance Setup'), icon: '', routerLink: ['/setup/insurance-setup'],
                                        visible: this.menuGuardSrv.hideOrShow(['insurance setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Approval Setup'), icon: '', routerLink: ['/setup/approval-setup'],
                                        visible: this.menuGuardSrv.hideOrShow(['approval setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('FS Caption'), icon: '',
                                        visible: this.menuGuardSrv.hideOrShow([
                                            'fs caption-group',
                                            'fs caption',
                                            'fs ratio-caption',
                                            'fs ratio-detail',
                                        ]),
                                        items: [
                                            {
                                                label: this.menuGuardSrv.translate('FS Caption-Group'), icon: '',
                                                routerLink: ['/setup/credit/customer-fscaption-group'],
                                                visible: this.menuGuardSrv.hideOrShow(['fs caption-group'])
                                            },
                                            {
                                                label: this.menuGuardSrv.translate('FS Caption'), icon: '',
                                                routerLink: ['/setup/credit/customer-fscaption'],
                                                visible: this.menuGuardSrv.hideOrShow(['fs caption'])
                                            },
                                            // {
                                            //     label: this.menuGuardSrv.translate('FS Ratio-Caption'), icon: '',
                                            //     routerLink: ['/setup/credit/customer-fsratio-caption'],
                                            //     visible: this.menuGuardSrv.hideOrShow(['fs ratio-caption'])
                                            // },
                                            {
                                                label: this.menuGuardSrv.translate('FS Derived Detail'), icon: '',
                                                routerLink: ['/setup/credit/customer-fsratio-detail'],
                                                visible: this.menuGuardSrv.hideOrShow(['fs ratio-detail'])
                                            },
                                        ]
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('TAT Setup'), icon: '',
                                        routerLink: ['/setup/credit/tat-setup'],
                                        visible: this.menuGuardSrv.hideOrShow(['tat setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Call Limit'), icon: '',
                                        routerLink: ['/setup/credit/call-limit'],
                                        visible: this.menuGuardSrv.hideOrShow(['call limit setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Job Request Feedback'), icon: '',
                                        routerLink: ['/setup/credit/job-request-feedback'],
                                        visible: this.menuGuardSrv.hideOrShow(['job request setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Job Type Admin'), icon: '',
                                        routerLink: ['/setup/credit/job-type-admin'],
                                        visible: this.menuGuardSrv.hideOrShow(['job request setup'])
                                    },

                                    {
                                        label: this.menuGuardSrv.translate('Job Hub Management'), icon: '',
                                        routerLink: ['/setup/credit/job-hub-staff'],
                                        visible: this.menuGuardSrv.hideOrShow(['job hub management'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Regulatory'), icon: '',
                                        visible: this.menuGuardSrv.hideOrShow(['collateral type setup', 'collateral sub-type setup']),
                                        items: [
                                            {
                                                label: this.menuGuardSrv.translate('Regulatory Setup'), icon: '', routerLink: ['/setup/regulatory/regulatory-setup'],
                                                visible: this.menuGuardSrv.hideOrShow(['collateral type setup'])
                                            },

                                        ],
                                    },
                                ]
                            },
                            {
                                label: this.menuGuardSrv.translate('Customer'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow([
                                    'group relationship type',
                                    'customer group',
                                    'group caption-detail',
                                ]),
                                items: [
                                    {
                                        label: this.menuGuardSrv.translate('Group Relationship Type'), icon: '', routerLink: ['/customer/customer-relationship-type'],
                                        visible: this.menuGuardSrv.hideOrShow(['group relationship type'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Customer Group'), icon: '', routerLink: ['/customer/customer-group'],
                                        visible: this.menuGuardSrv.hideOrShow(['customer group'])
                                    },
                                    // {
                                    //     label: this.menuGuardSrv.translate('Caption-Detail (Group)'), icon: '',
                                    //     routerLink: ['/setup/credit/customer-group-fscaption-detail'],
                                    //     visible: this.menuGuardSrv.hideOrShow(['group caption-detail'])
                                    // },
                                ]
                            },
                            {
                                label: this.menuGuardSrv.translate('Approval'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow([
                                    'approval group',
                                    'approval level',
                                    'approval workflow',
                                    'approval relief',
                                   
                                ]),
                                items: [
                                    {
                                        label: this.menuGuardSrv.translate('Group'), icon: '', routerLink: ['/setup/approval-group'],
                                        visible: this.menuGuardSrv.hideOrShow(['approval group'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Level'), icon: '', routerLink: ['/setup/approval-level'],
                                        visible: this.menuGuardSrv.hideOrShow(['approval level'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Workflow'), icon: '', routerLink: ['/setup/approval-workflow'],
                                        visible: this.menuGuardSrv.hideOrShow(['approval workflow'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Relief'), icon: '', routerLink: ['/setup/approval-relief'],
                                        visible: this.menuGuardSrv.hideOrShow(['approval relief'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Rule'), icon: '', routerLink: ['/setup/approval-level-rule'],
                                        visible: this.menuGuardSrv.hideOrShow(['approval level'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Workflow Change'), icon: '', routerLink:['/setup/approval-workflowchange'],
                                        visible:this.menuGuardSrv.hideOrShow(['approval workflow'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Operational Flow Page'), icon: '', routerLink:['/setup/operational-flowpage'],
                                        visible:this.menuGuardSrv.hideOrShow(['operational flowpage'])
                                    },

                                ]
                            },
                            {
                                label: this.menuGuardSrv.translate('Location'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow([
                                    'company setup',
                                    'region setup',
                                    'branch setup',
                                    'department setup',
                                    'unit setup',
                                    'state setup',
                                    'city setup',
                                ]),
                                items: [
                                    {
                                        label: this.menuGuardSrv.translate('Company'), icon: '', routerLink: ['/setup/company'],
                                        visible: this.menuGuardSrv.hideOrShow(['company setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Region'), icon: '', routerLink: ['/setup/region'],
                                        visible: this.menuGuardSrv.hideOrShow(['region setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Branch'), icon: '', routerLink: ['/setup/branch'],
                                        visible: this.menuGuardSrv.hideOrShow(['branch setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Department'), icon: '', routerLink: ['/setup/department'],
                                        visible: this.menuGuardSrv.hideOrShow(['department setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Unit'), icon: '', routerLink: ['/setup/units'],
                                        visible: this.menuGuardSrv.hideOrShow(['unit setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Local Govt'), icon: '', routerLink: ['/setup/local-govt'],
                                        visible: this.menuGuardSrv.hideOrShow(['state setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('State'), icon: '', routerLink: ['/setup/state'],
                                        visible: this.menuGuardSrv.hideOrShow(['state setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('City'), icon: '', routerLink: ['/setup/cities'],
                                        visible: this.menuGuardSrv.hideOrShow(['city setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Subsidiary'), icon: '', routerLink: ['/setup/subsidiaries'],
                                        visible: this.menuGuardSrv.hideOrShow(['branch setup'])
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        label: this.menuGuardSrv.translate('FINCON Admin'), icon: '',
                        visible: this.menuGuardSrv.hideOrShow([
                            'tax setup',
                            'fee and charge setup',
                            'product process setup',
                            'product class setup',
                            'product group setup',
                            'product type setup',
                            'product definition setup',
                            'product maintenance setup',
                            'document mapping setup',
                            'ledger account type',
                            'chart of account'
                        ]),
                        items: [

                            {
                                label: this.menuGuardSrv.translate('Fee and Charge Setup'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow(['tax setup', 'fee and charge setup']),
                                items: [
                                    // {
                                    //     label: this.menuGuardSrv.translate('Tax'), icon: '', routerLink: ['/setup/charge/tax'],
                                    //     visible: this.menuGuardSrv.hideOrShow(['tax setup'])
                                    // },
                                    {
                                        label: this.menuGuardSrv.translate('Fees/Charges'), icon: '', routerLink: ['/setup/charge/charge'],
                                        visible: this.menuGuardSrv.hideOrShow(['fee and charge setup'])
                                    },

                                ]
                            },
                            {
                                label: this.menuGuardSrv.translate('Product'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow([
                                    'product process setup',
                                    'product class setup',
                                    'product group setup',
                                    'product type setup',
                                    'product definition setup',
                                    'product maintenance setup',
                                    'document definition setup',
                                    'document mapping setup'

                                ]),
                                items: [
                                    {
                                        label: this.menuGuardSrv.translate('Process'), icon: '', routerLink: ['/setup/product/product-process'],
                                        visible: this.menuGuardSrv.hideOrShow(['product process setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Class'), icon: '', routerLink: ['/setup/product/product-class'],
                                        visible: this.menuGuardSrv.hideOrShow(['product class setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Group'), icon: '', routerLink: ['/setup/product/product-group'],
                                        visible: this.menuGuardSrv.hideOrShow(['product group setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Type'), icon: '', routerLink: ['/setup/product/product-type'],
                                        visible: this.menuGuardSrv.hideOrShow(['product type setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Definition'), icon: '', routerLink: ['/setup/product/product-definition'],
                                        visible: this.menuGuardSrv.hideOrShow(['product definition setup'])
                                    },
                                    // {
                                    //     label: this.menuGuardSrv.translate('Document Definition'), icon: '', routerLink: ['/setup/product/document-definition'],
                                    //     visible: this.menuGuardSrv.hideOrShow(['document definition setup'])
                                    // },
                                    {
                                        label: this.menuGuardSrv.translate('Product Document Mapping'), icon: '', routerLink: ['/setup/product/document-mapping'],
                                        visible: this.menuGuardSrv.hideOrShow(['document mapping setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Maintenance'), icon: '', routerLink: ['/setup/product/product-maintenance'],
                                        visible: this.menuGuardSrv.hideOrShow(['product maintenance setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Price Index'), icon: '', routerLink: ['/setup/product/product-price-index'],
                                        visible: this.menuGuardSrv.hideOrShow(['product definition setup'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Product UDE Maintenance'), icon: '', routerLink: ['/setup/product/product-ude'],
                                        visible: this.menuGuardSrv.hideOrShow(['product ude setup'])
                                    }
                                ]
                            },

                            {
                                label: this.menuGuardSrv.translate('Finance'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow(['ledger account type', 'chart of account']),
                                items: [
                                    {
                                        label: this.menuGuardSrv.translate('Ledger Account Type'), icon: '', routerLink: ['/setup/finance/ledger'],
                                        visible: this.menuGuardSrv.hideOrShow(['ledger account type'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Chart of Account'), icon: '', routerLink: ['/setup/finance/account-chart'],
                                        visible: this.menuGuardSrv.hideOrShow(['chart of account'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Custom Chart of Account'), icon: '', routerLink: ['/setup/finance/custom-account-chart'],
                                        visible: this.menuGuardSrv.hideOrShow(['chart of account'])
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        label: this.menuGuardSrv.translate('Bulk Disbursement'), icon: '', routerLink: ['/admin/bulk-disbursement'],
                        visible: this.menuGuardSrv.hideOrShow(['bulk disbursement'])
                    },

                   

                ]
            },
            {
                label: this.menuGuardSrv.translate('Power BI'), icon: 'link', routerLink: ['/credit/loan-management/external-link-directive'],
                visible: this.menuGuardSrv.hideOrShow(['external link'])
            },

            // {
            //     label: this.menuGuardSrv.translate('Setup'), icon: 'build',
            //     visible: this.menuGuardSrv.hideOrShow([
            //         'collateral type setup',
            //         'collateral sub-type setup',
            //         'accredited consultants',
            //         'approved employers setup',
            //         'approved fts markets setup',
            //         'limit maintenance',
            //         'email alert setup',
            //         'document repository setup',
            //         'checklist definition setup',
            //         'default conditions setup',
            //         'transaction dynamics setup',
            //         'compliance timeline setup',
            //         'covenant types setup',
            //         'prudential guidelines setup',
            //         'fs caption-group',
            //         'fs caption',
            //         'group caption-detail',
            //         'fs ratio-caption',
            //         'fs ratio-detail',
            //         'call limit setup',
            //         'job request setup',
            //         'product process setup',
            //         'product class setup',
            //         'product group setup',
            //         'product type setup',
            //         'product definition setup',
            //         'product maintenance setup',
            //         'group relationship type',
            //         'customer group',
            //         'company setup',
            //         'region setup',
            //         'branch setup',
            //         'department setup',
            //         'unit setup',
            //         'state setup',
            //         'city setup',
            //         'approval group',
            //         'approval level',
            //         'approval workflow',
            //         'approval relief',
            //     ]),
            //     items: [


            //         //
            //         //     label: this.menuGuardSrv.translate('Risk'), icon: '',
            //         //     visible: this.menuGuardSrv.hideOrShow(['risk index', 'risk scoring']),
            //         //     items: [
            //         //         {
            //         //             label: this.menuGuardSrv.translate('Index'), icon: '', routerLink: ['/setup/risk/risk-index'],
            //         //             visible: this.menuGuardSrv.hideOrShow(['risk index'])
            //         //         },
            //         //         {
            //         //             label: this.menuGuardSrv.translate('Scoring'), icon: '', routerLink: ['/setup/risk/risk-scoring'],
            //         //             visible: this.menuGuardSrv.hideOrShow(['risk scoring'])
            //         //         },
            //         //     ]
            //         // },
            //     ]
            // },
            {
                label: this.menuGuardSrv.translate('Customer Management'), icon: 'account_box',
                visible: this.menuGuardSrv.hideOrShow([
                    'customer profile',
                    'casa search',
                    'customer caption detail',
                    'view financial statement',
                    'group caption-detail'
                ]),
                items: [
                    {
                        label: this.menuGuardSrv.translate('Customer Profile'), icon: '', routerLink: ['/customer/customer-information'],
                        visible: this.menuGuardSrv.hideOrShow(['customer profile'])
                    },
                    {
                        //label: this.menuGuardSrv.translate('Update Prospect Information'), icon: '', routerLink: ['/customer/prospect-customer'],
                        label: this.menuGuardSrv.translate('Convert Prospect To Customer'), icon: '', routerLink: ['/customer/prospect-customer'],
                        visible: this.menuGuardSrv.hideOrShow(['customer profile'])
                    },
                    {
                        label: this.menuGuardSrv.translate('International Customer Verification'), icon: '', routerLink: ['/customer/global-customer-verification'],
                        visible: this.menuGuardSrv.hideOrShow(['customer profile'])
                    },
                    // {
                    //     label: this.menuGuardSrv.translate('CASA Search'), icon: '', routerLink: ['/customer/casa'],
                    //     visible: this.menuGuardSrv.hideOrShow(['casa search'])
                    // },
                    {
                        label: this.menuGuardSrv.translate('Financial Caption (Customer)'), icon: '', routerLink: ['/setup/credit/customer-fscaption-detail'],
                        visible: this.menuGuardSrv.hideOrShow(['customer caption detail'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Caption-Detail (Group)'), icon: '',
                        routerLink: ['/setup/credit/customer-group-fscaption-detail'],
                        visible: this.menuGuardSrv.hideOrShow(['group caption-detail'])
                    },
                    {
                        label: this.menuGuardSrv.translate('View Financial Statement'), icon: '', routerLink: ['/setup/credit/view-financial-statement'],
                        visible: this.menuGuardSrv.hideOrShow(['view financial statement'])
                    }
                ]
            },
            {
                label: this.menuGuardSrv.translate('Approvals'), icon: 'check_circle',
                visible: this.authService.verifyCorr() && this.menuGuardSrv.hideOrShow([
                    // 'approval trail',
                    'customer profile approval',
                    'user setup approval',
                    'user-role setup approval',
                    'product setup approval',
                    'chart of account setup approval',
                    'customer group setup approval',
                    'aps approval',
                    'loan disbursment',
                    'booking verifier',
                    'loan recovery payment',
                    'drawdown approval',
                    'checklist deferral approval',
                    'concession approval',
                    'pen approval',
                    'override approval',
                    'reasigned accounts approval',
                    'credit operations approval',
                    'credit operation approval - commercial paper',
                    'collateral approval',
                    'collateral policy approval',
                    'collateral assignment approval',
                    'collateral release approval',
                    'Lc Issuance Approval',
                    'Release Of Shipping Documents Approval',
                    'Lc Ussance Approval',
                    'Lc Cancellation Approval',
                    'Lc Enhancement Approval',
                    'Lc Extension Approval',
                    'Lc Ussance Extension Approval',
                    'ATC Lodgement Approval',
                    'ATC Release Approval',
                    'Project Site Report Approval',
                    'Letter Generation Request Approval',
                    'security release approval',
                    'collateral valuation approval',
                    'security-release-approval',
                    'call-memo approval',
                    // 'deferred document approval'
                ]),
                items: [
                    // {
                    //     label: this.menuGuardSrv.translate('Approval Trail'), icon: '', routerLink: ['/admin/audit-trail'],
                    //     visible: this.menuGuardSrv.hideOrShow(['approval trail'])
                    // },
                    {
                        label: this.menuGuardSrv.translate('Customer Profile'), icon: '', routerLink: ['/approvals/admin/customer'],
                        visible: this.menuGuardSrv.hideOrShow(['customer profile approval'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Related Employer'), icon: '', routerLink: ['/approvals/admin/related-employer'],
                        visible: this.menuGuardSrv.hideOrShow(['related employer approval'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Setup'), icon: '',
                        visible: this.menuGuardSrv.hideOrShow([
                            'user setup approval',
                            'user-role setup approval',
                            'product setup approval',
                            'chart of account setup approval',
                            'customer group setup approval'
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('User'), icon: '', routerLink: ['/approvals/admin/staff'],
                                visible: this.menuGuardSrv.hideOrShow(['user setup approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('User Delete'), icon: '', routerLink: ['/approvals/admin/staff-delete'],
                                visible: this.menuGuardSrv.hideOrShow(['user setup approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('User Account Status'), icon: '', routerLink: ['/approvals/admin/user-account-status'],
                                visible: this.menuGuardSrv.hideOrShow(['user setup approval'])
                            },

                            {
                                label: this.menuGuardSrv.translate('User Role'), icon: '', routerLink: ['/approvals/admin/staff-role'],
                                visible: this.menuGuardSrv.hideOrShow(['user-role setup approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Fee/Charge'), icon: '', routerLink: ['/approvals/admin/fee-charge'],
                                visible: this.menuGuardSrv.hideOrShow(['user-role setup approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Product'), icon: '', routerLink: ['/approvals/admin/product'],
                                visible: this.menuGuardSrv.hideOrShow(['product setup approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Chart of Account'), icon: '', routerLink: ['/approvals/admin/chart-of-account'],
                                visible: this.menuGuardSrv.hideOrShow(['chart of account setup approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Customer Groups'), icon: '', routerLink: ['/approvals/admin/customer-group'],
                                visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                            },

                            {
                                label: this.menuGuardSrv.translate('Customer Group Mapping'), icon: '', routerLink: ['/approvals/admin/customer-group-mapping'],
                                visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Workflow Group Approval'), icon: '', routerLink: ['/approvals/approval-workflow-group'],
                                visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Workflow Level Approval'), icon: '', routerLink: ['/approvals/approval-workflow-level'],
                                visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Workflow Level Staff'), icon: '', routerLink: ['/approvals/approval-level-staff'],
                                visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Staff Relief Approval'), icon: '', routerLink: ['/approvals/staff-relief-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                            },

                        ]
                    },
                    {
                        label: this.menuGuardSrv.translate('Credit'), icon: '',
                        visible: this.menuGuardSrv.hideOrShow([
                            'aps approval',
                            'loan disbursment',
                            'booking verifier',
                            'loan recovery payment',
                            'drawdown approval',
                            'checklist deferral approval',
                            'concession approval',
                            'pen approval',
                            'override approval',
                            'reasigned accounts approval',
                            'credit operations approval',
                            'credit operation approval - commercial paper',
                            'Lc Issuance Approval',
                            'Release Of Shipping Documents Approval',
                            'Lc Ussance Approval',
                            'Lc Cancellation Approval',
                            'Lc Enhancement Approval',
                            'Lc Extension Approval',
                            'Lc Ussance Extension Approval',
                            'Original Document Approval',
                            'ATC Lodgement Approval',
                            'ATC Release Approval',
                            'Project Site Report Approval',
                            'Letter Generation Request Approval',
                            'security release approval',
                            'call memo approval',
                            'deferred document approval',
                            'deferral extension approval',
                            'bulk liquidation approval',
                            'Modify Facility',
                            'credit documentation approval'
                            
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('APS'), icon: '', routerLink: ['/approvals/credit/advance-payment-sum-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['aps approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Booking Verification'), icon: '', routerLink: ['/approvals/credit/loan-booking-verification'],
                                visible: this.menuGuardSrv.hideOrShow(['booking verifier'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Loan Recovery Payment'), icon: '', routerLink: ['/credit/loan-management/loan-recovery-repayment-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['loan recovery payment'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Disbursement'), icon: '', routerLink: ['/approvals/credit/loan-disbursement'],
                                visible: this.menuGuardSrv.hideOrShow(['loan disbursment'])
                            }, 
                            {
                                label: this.menuGuardSrv.translate('Multiple Disbursement '), icon: '', routerLink: ['/approvals/credit/bulk-loan-disbursement-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['loan disbursment'])
                            }, 
                            {
                                label: this.menuGuardSrv.translate('Contingents Release Approval'), icon: '', routerLink: ['/approvals/credit/loan-booking'],
                                visible: this.menuGuardSrv.hideOrShow(['bonds and guarantee','bonds and guarantee approver'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Drawdown Approval'), icon: '', routerLink: ['/approvals/credit/tranche-booking'],
                                visible: this.menuGuardSrv.hideOrShow(['drawdown approval'])
                            },
                           
                            {
                                label: this.menuGuardSrv.translate('Adhoc Approval'), icon: '', routerLink: ['/approvals/credit/adhoc-approvals'],
                                visible: this.menuGuardSrv.hideOrShow(['Adhoc Approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Exceptional Loan'), icon: '', routerLink: ['/approvals/credit/exceptional-loan-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['exceptional loan approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Exceptional Loan Search'), icon: '', routerLink: ['/approvals/credit/exceptional-loan-search'],
                                visible: this.menuGuardSrv.hideOrShow(['exceptional loan approval'])
                            },

                            {
                                label: this.menuGuardSrv.translate('Letter Of Credit Approvals'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow(['Lc Issuance Approval', 'Release Of Shipping Documents Approval',
                                                                    'Lc Extension Approval','Lc Ussance Extension Approval',
                                                                    'Lc Ussance Approval','Lc Cancellation Approval','Lc Enhancement Approval']),
                                items: [
                                    {
                                        label: this.menuGuardSrv.translate('LC Issuance Approval'), icon: '', routerLink: ['/credit/lc/issuance-approval'],
                                        visible: this.menuGuardSrv.hideOrShow(['Lc Issuance Approval'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Release Of Shipping Documents Approval'), icon: '', routerLink: ['/credit/lc/release-approval'],
                                        visible: this.menuGuardSrv.hideOrShow(['Release Of Shipping Documents Approval'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('LC Usance Approval'), icon: '', routerLink: ['/credit/lc/ussance-approval'],
                                        visible: this.menuGuardSrv.hideOrShow(['Lc Ussance Approval'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Lc Cancellation Approval'), icon: '', routerLink: ['/credit/lc/cancelation-approval'],
                                        visible: this.menuGuardSrv.hideOrShow(['Lc Cancellation Approval'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Lc Enhancement Approval'), icon: '', routerLink: ['/credit/lc/enhancement-approval'],
                                        visible: this.menuGuardSrv.hideOrShow(['Lc Enhancement Approval'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Lc Issuance Extension Approval'), icon: '', routerLink: ['/credit/lc/extension-approval'],
                                        visible: this.menuGuardSrv.hideOrShow(['Lc Extension Approval'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Lc Ussance Extension Approval'), icon: '', routerLink: ['/credit/lc/ussance-extension-approval'],
                                        visible: this.menuGuardSrv.hideOrShow(['Lc Ussance Extension Approval'])
                                    }
                                ]
                            },
                            {
                                label: this.menuGuardSrv.translate('Letter Generation Request Approval'), icon: '', routerLink: ['/approvals/letter-generation-request-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['Letter Generation Request Approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Deferral/Waiver Approvals'), icon: '', routerLink: ['/approvals/credit/checklist-deferral-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['checklist deferral approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Fee/Rate Concession'), icon: '', routerLink: ['/approvals/credit/fee-concession-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['concession approval'])
                            },
                            //                             {
                            // // tslint:disable-next-line: max-line-length
                            //                                 label: this.menuGuardSrv.translate('Preliminary Evaluation Note'), icon: '', routerLink: ['/approvals/credit/preliminary-evaluation-note'],
                            //                                 visible: this.menuGuardSrv.hideOrShow(['pen approval'])
                            //                             },
                            {
                                label: this.menuGuardSrv.translate('Override'), icon: '', routerLink: ['/approvals/credit/override-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['override approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Reasigned Accounts'), icon: '', routerLink: ['/approvals/credit/reasign-account'],
                                visible: this.menuGuardSrv.hideOrShow(['reasigned accounts approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Credit Operations'), icon: '', routerLink: ['/approvals/credit/loan-restructuring'],
                                visible: this.menuGuardSrv.hideOrShow(['credit operations approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Line Operations'), icon: '', routerLink: ['/approvals/credit/line-operation-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['credit operations approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Commercial Loan Operations'), icon: '', routerLink: ['/approvals/credit/commercial-loan-operations-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['credit operation approval - commercial paper'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Written-off Accounts / Black-Book'), icon: '', routerLink: ['/approvals/credit/camsol-blackbook'],
                                visible: this.menuGuardSrv.hideOrShow(['risk assessment'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Bulk Loan Prepayment'), icon: '', routerLink: ['/approvals/bulk-prepayment-loan-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['bulk liquidation approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Release Lien Approval'), icon: '', routerLink: ['/approvals/lien-removal-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['lien removal approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Bulk Recovery Assignment'), icon: '', routerLink: ['/approvals/bulk-recovery-assignment-to-agen-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['bulk recovery assignment to agent approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Bulk Retail Recovery Assignment'), icon: '', routerLink: ['/approvals/bulk-retail-recovery-assignment-to-agen-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['bulk retail recovery assignment to agent approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Bulk Recovery Unassignment'), icon: '', routerLink: ['/approvals/bulk-recovery-unassignment-from-agent'],
                                visible: this.menuGuardSrv.hideOrShow(['bulk recovery unassignment from agent approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Retail Recovery Unassignment'), icon: '', routerLink: ['/approvals/bulk-retail-recovery-unassignment-from-agent'],
                                visible: this.menuGuardSrv.hideOrShow(['bulk retail recovery unassignment from agent approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Recovery Reporting'), icon: '', routerLink: ['/approvals/bulk-recovery-reporting-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['bulk recovery assignment to agent approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Recovery Commission'), icon: '', routerLink: ['/approvals/bulk-recovery-commission-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['bulk recovery assignment to agent approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Loan Application Cancellation'), icon: '', routerLink: ['/approvals/loan-application-cancellation'],
                                visible: this.menuGuardSrv.hideOrShow(['aps approval'])
                            },

                            {
                                label: this.menuGuardSrv.translate('Accredited Consultants Approval'), icon: '', routerLink: ['/approvals/accredited-solicitors-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Manual Fee Approval'), icon: '', routerLink: ['/approvals/credit/take-fee-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['manual fee approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Global Interest Rate Change Approval'), icon: '', routerLink: ['/approvals/credit/global-interest-rate-change-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['global interest rate change approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Original Document Approval'), icon: '', routerLink: ['/approvals/credit/original-document-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['Original Document Approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('ATC Lodgement Approval'), icon: '', routerLink: ['/approvals/credit/atc-lodgement-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['ATC Lodgement Approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('ATC Release Approval'), icon: '', routerLink: ['/approvals/credit/app-atc-release-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['ATC Release Approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Project Site Report Approval'), icon: '', routerLink: ['/approvals/project-site-report-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['Project Site Report Approval'])
                            },
                            
                           
                            {
                                label: this.menuGuardSrv.translate('Security Release Approval'), icon: '', routerLink: ['/approvals/security-release-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['security release approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Cash Security Release'), icon: '', routerLink: ['/approvals/cash-security-release-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['security release approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Call Memo Approval'), icon: '', routerLink: ['/approvals/call-memo-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['call memo approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Deferred Document Approval'), icon: '', routerLink: ['/approvals/deferral-document-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['deferred document approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Deferral Extension Approval'), icon: '', routerLink: ['/approvals/deferral-extension-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['deferral extension approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Facility Modification Approval'), icon: '', routerLink: ['/approvals/credit/modify-facility-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['Modify Facility'])
                            },
                            {
                                label: this.menuGuardSrv.translate('LMS Facility Modification Approval'), icon: '', routerLink: ['/approvals/credit/modify-lms-facility-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['Modify Facility'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Documentation Filling Approval'), icon: '', routerLink: ['/approvals/credit/credit-documentation-filling-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['credit documentation approval'])
                            }
                        ]
                    },
                    {
                        label: this.menuGuardSrv.translate('Collateral'), icon: '',
                        visible: this.menuGuardSrv.hideOrShow([
                            'collateral approval',
                            'collateral policy approval',
                            'collateral assignment approval',
                            'collateral release approval',
                            'collateral swap approval'
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('Collateral Management'), icon: '', routerLink: ['/approvals/credit/collateral-management-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Insurance Policy'), icon: '', routerLink: ['/approvals/credit/collateral-item-policy-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral policy approval'])
                            },
                            // {
                            //     label: this.menuGuardSrv.translate('Collateral Assignment'), icon: '', routerLink: ['/approvals/credit/collateral-assignment-approval'],
                            //     visible: this.menuGuardSrv.hideOrShow(['collateral assignment approval'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Collateral Swap'), icon: '', routerLink: ['/approvals/collateral-swap-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral swap approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Release'), icon: '', routerLink: ['/approvals/credit/collateral-release-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral release approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Info Release'), icon: '', routerLink: ['/approvals/credit/collateral-information-release-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral release approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Valuation Approval'), icon: '', routerLink: ['/approvals/collateral-valuation-approval'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral valuation approval'])
                            },
                        ]
                    },

                ]
            },

            {
                label: this.menuGuardSrv.translate('Job Request'), icon: 'account_box',
                visible: this.menuGuardSrv.hideOrShow([
                    'job request status',

                ]),
                items: [
                    {
                        label: this.menuGuardSrv.translate('Job Request Status'), icon: '', routerLink: ['/credit/credit-job-request'],
                        visible: this.menuGuardSrv.hideOrShow(['job request status'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Facility Job Request'), icon: '', routerLink: ['/credit/facility-job-request'],
                        visible: this.menuGuardSrv.hideOrShow(['confirm collateral search'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Confirm Collateral Search'), icon: '', routerLink: ['/credit/legal-job-request-confirmation'],
                        visible: this.menuGuardSrv.hideOrShow(['confirm collateral search'])
                    },
                ]
            },

            {
                label: this.menuGuardSrv.translate('Credit'), icon: 'account_balance_wallet',
                visible: this.authService.verifyCorr() && this.menuGuardSrv.hideOrShow([
                    //'repayment schedule simulation',
                    'schedule simulation',
                    'start credit application',
                    'credit applications',
                    'credit application status',
                    'contingent application search',
                    'bonds and guarantee',
                    'rejected applications',
                    'loan fee concessions',
                    'deferral management',
                    'consumer protection',
                    'lien management',
                    'credit documentation',
                    //'preliminary evaluation notes',
                    'application route',
                    'credit appraisal',
                    'cashflow lending',
                    'committee secretariat',
                    'generate offer letter',
                    'review offer letter',
                    'availment',
                    'booking request',
                    'booking',
                    //'job request status',
                    'confirm collateral search',
                    'override request',
                    'lms application',
                    'lms appraisal',
                    'lms generate offer letter',
                    'lms availment',
                    'loan operations',
                    'overdraft operations',
                    'recovery operations',
                    'contingent operations',
                    'recovery payment plan',
                    'prepayment',
                    'aps request',
                    'reassign account',
                    'collateral information',
                    'collateral assignment',
                    ' covenant maintenance',
                    'risk assessment',
                    'facility detail summary',
                    'credit classification',
                    'fee charge change',
                    'maturity instruction',
                    'commercial loan rollover',
                    'commercial loan tenor extension',
                    'commercial loan sub-allocation',
                    'commercial loan rate review',
                    'commercial loan prepayment',
                    //'availmant route',
                    'risk assessment',
                    //'deferral management',
                    'Original Document',
                    'original document search',
                    'security release',
                    'security release search',
                    'Letter Generation Request',
                    'Letter Generation Completed',
                    //'letter generation search',
                    'document search',
                    'crms-user',
                    'Modify Facility',
                    'Reassign Loan',
                    'appraisal pool',

                ]),
                items: [
                    {
                        label: this.menuGuardSrv.translate('Credit Origination'), icon: '',
                        visible: this.menuGuardSrv.hideOrShow([
                            //'repayment schedule simulation',
                            'start credit application',
                            'credit applications',
                            'credit application status',
                            'drawdown application status',
                            'bonds and guarantee',
                            'rejected applications',
                            'loan fee concessions',
                            //'deferral management',
                            //'preliminary evaluation notes',
                            'application route',
                            'credit appraisal',
                            'cashflow lending',
                            'failed transaction',
                            'committee secretariat',
                            'generate offer letter',
                            'review offer letter',
                            'availment',
                            'booking request',
                            'booking',
                            //'call memo',
                            //'job request status',
                            'confirm collateral search',
                            'override request',
                            //'availmant route',
                            //'term sheet',
                            'Release Of Shipping Documents',
                            'Lc Issuance',
                            'Lc Ussance',
                            'Letter Generation Request',
                            'Letter Generation Completed',
                            //'letter generation search',
                            'security release',
                            'security release search',
                             'document search',
                             'crms-user',
                             'Modify Facility',
                             'Reassign Loan',
                             'appraisal pool',
                             'credit documentation los',
                             

                        ]),
                        items: [
                            // {
                            //     label: this.menuGuardSrv.translate('MAP'), icon: '', routerLink: ['/credit/loan/map'],
                            //     visible: this.menuGuardSrv.hideOrShow(['schedule simulation'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Document Search'), icon: '', routerLink: ['/credit/loan/document-Search'],
                                visible: this.menuGuardSrv.hideOrShow(['document search'])
                            },

                            {
                                label: this.menuGuardSrv.translate('ATC Lodgement'), icon: '', routerLink: ['/credit/loan/atc-lodgment'],
                                visible: this.menuGuardSrv.hideOrShow(['ATC Lodgement'])
                            },
                            {
                                label: this.menuGuardSrv.translate('ATC Release'), icon: '', routerLink: ['/credit/loan/atc-release'],
                                visible: this.menuGuardSrv.hideOrShow(['ATC Release'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Disbursed Loans'), icon: '', routerLink: ['/credit/loan/disbursed-loans'],
                                visible: this.menuGuardSrv.hideOrShow([
                                    'loan disbursment',
                                    'booking request',
                                    'booking',
                                ])
                            },
                            {
                                label: this.menuGuardSrv.translate('Modify Facility'), icon: '', routerLink: ['/credit/loan/modify-facility'],
                                visible: this.menuGuardSrv.hideOrShow(['Modify Facility','Reassign Loan'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Loan Fee Schedule'), icon: '', routerLink: ['/credit/loan/loan-fee-schedule'],
                                visible: this.menuGuardSrv.hideOrShow([
                                    // 'start credit application',
                                    // 'credit applications',
                                    // 'credit appraisal',
                                    // 'booking request',
                                    // 'booking',
                                    // 'schedule simulation',
                                    // 'loan disbursment',
                                    // 'project-site-report',
                                    'loan fee schedule'
                                ])
                            },
                            // {
                            //     label: this.menuGuardSrv.translate('Repayment Schedule Simulation'), icon: '', routerLink: ['/credit/loan/schedule'],
                            //     visible: this.menuGuardSrv.hideOrShow(['schedule simulation'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('View Product Checklist'), icon: '', routerLink: ['/credit/loan/checklist-simulation'],
                                visible: this.menuGuardSrv.hideOrShow(['schedule simulation'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Letter Of Credit'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow(['Lc Issuance', 'Release Of Shipping Documents', 'Lc Ussance',
                                    'Lc Issuance Approval',
                                    'Release Of Shipping Documents Approval',
                                    'Lc Ussance Approval',
                                ]),
                                items: [
                                    {
                                        label: this.menuGuardSrv.translate('LC Search'), icon: '', routerLink: ['/credit/lc/search'],
                                        visible: this.menuGuardSrv.hideOrShow([
                                            'Release Of Shipping Documents',
                                            'Lc Issuance',
                                            'Lc Ussance',
                                            'Lc Issuance Approval',
                                            'Release Of Shipping Documents Approval',
                                            'Lc Ussance Approval',
                                        ])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('LC Issuance'), icon: '', routerLink: ['/credit/lc/issuance'],
                                        visible: this.menuGuardSrv.hideOrShow(['Lc Issuance'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Release Of Shipping Document'), icon: '', routerLink: ['/credit/lc/release-shipping-documents'],
                                        visible: this.menuGuardSrv.hideOrShow(['Release Of Shipping Documents'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('LC Ussance'), icon: '', routerLink: ['/credit/lc/ussance'],
                                        visible: this.menuGuardSrv.hideOrShow(['Lc Ussance'])
                                    }
                                ]
                            },
                            {
                                label: this.menuGuardSrv.translate('Letter Generation Request'), icon: '', routerLink: ['/credit/letter-generation-request'],
                                visible: this.menuGuardSrv.hideOrShow(['Letter Generation Request'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Letter Generation Search'), icon: '', routerLink: ['/setup/letter-generation-search'],
                                visible: this.menuGuardSrv.hideOrShow(['Letter Generation Completed',
                                                                        'Letter Generation Request',
                                                                        'Letter Generation Request Approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Letter Generation Completed'), icon: '', routerLink: ['/credit/letter-generation-completed'],
                                visible: this.menuGuardSrv.hideOrShow(['Letter Generation Completed',
                                                                        'Letter Generation Request',
                                                                        'Letter Generation Request Approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Start Credit Application'), icon: '', routerLink: ['/credit/loan/application/start'],
                                visible: this.menuGuardSrv.hideOrShow(['start credit application'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Credit Applications'), icon: '', routerLink: ['/credit/loan/loan-application-list'],
                                visible: this.menuGuardSrv.hideOrShow(['credit applications'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Credit Application Status'), icon: '', routerLink: ['/credit/loan/application-search'],
                                visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Credit Bureau Status'), icon: '', routerLink: ['/credit/loan/customer/credit-bureau-report'],
                                visible: this.menuGuardSrv.hideOrShow(['start credit application'])
                            },


                            // {
                            //     label: this.menuGuardSrv.translate('DrawDown Application Status'), icon: '', routerLink: ['/credit/loan/drawdown-search'],
                            //     visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                            // },
                            // {
                            //     label: this.menuGuardSrv.translate('Bonds and Guarantee'), icon: '', routerLink: ['/credit/loan/bonds-and-guarantee'],
                            //     visible: this.menuGuardSrv.hideOrShow(['bonds and guarantee'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Rejected Applications'), icon: '', routerLink: ['/credit/loan/rejected-application'],
                                visible: this.menuGuardSrv.hideOrShow(['rejected applications'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Loan Fee Concessions'), icon: '', routerLink: ['/credit/loan/application/fee-concession'],
                                visible: this.menuGuardSrv.hideOrShow(['loan fee concessions'])
                            },

                            // {
                            //     label: this.menuGuardSrv.translate('Routing'), icon: '',
                            //     visible: this.menuGuardSrv.hideOrShow([
                            //         'application route',
                            //         'availment route',
                            //     ]),
                            //     items: [
                            // {
                            //     label: this.menuGuardSrv.translate('Preliminary Evaluation Notes'), icon: '', routerLink: ['/credit/loan/preliminary-evaluation/view'],
                            //     visible: this.menuGuardSrv.hideOrShow(['preliminary evaluation notes'])
                            // },
                            // {
                            //     label: this.menuGuardSrv.translate('Routing'), icon: '',
                            //     visible: this.menuGuardSrv.hideOrShow([
                            //         'application route',
                            //         'availment route',
                            //     ]),
                            //     items: [
                            {
                                label: this.menuGuardSrv.translate('Application Route'), icon: '', routerLink: ['/credit/appraisal/sla-monitoring'],
                                visible: this.menuGuardSrv.hideOrShow(['application route'])
                            },
                            // {
                            //     label: this.menuGuardSrv.translate('Availment Route'), icon: '', routerLink: ['/credit/appraisal/availment-route'],
                            //     visible: this.menuGuardSrv.hideOrShow(['availment route'])
                            // },
                            //     ]
                            // },
                            {
                                label: this.menuGuardSrv.translate('Term Sheet'), icon: '', routerLink: ['/credit/term-sheet'],
                                visible: this.menuGuardSrv.hideOrShow([
                                    'start credit application',
                                ])
                            },
                            {
                                label: this.menuGuardSrv.translate('CashFlow Document Review'), icon: '', routerLink: ['/credit/cashflow/document-review'],
                                visible: this.menuGuardSrv.hideOrShow(['cashflow lending'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Credit Appraisal'), icon: '', routerLink: ['/credit/appraisal/credit-appraisal'],
                                visible: this.menuGuardSrv.hideOrShow(['credit appraisal'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Failed Transactions'), icon: '', routerLink: ['/credit/failed-transactions'],
                                visible: this.menuGuardSrv.hideOrShow(['failed transactions'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Committee Secretariat'), icon: '', routerLink: ['/credit/loan/secretariat'],
                                visible: this.menuGuardSrv.hideOrShow(['committee secretariat'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Generate Offer Letter'), icon: '', routerLink: ['/credit/loan/offer-letter'],
                                visible: this.menuGuardSrv.hideOrShow(['generate offer letter'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Review Offer Letter'), icon: '', routerLink: ['/credit/loan/offer-letter-review'],
                                visible: this.menuGuardSrv.hideOrShow(['review offer letter'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Availment'), icon: '', routerLink: ['/credit/loan/availment'],
                                visible: this.menuGuardSrv.hideOrShow(['availment'])
                            },
                            {
                                label: this.menuGuardSrv.translate('DrawDown Request'), icon: '', routerLink: ['/credit/loan/booking/initiate-booking'],
                                visible: this.menuGuardSrv.hideOrShow(['booking request'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Bulk Disbursement Request'), icon: '', routerLink: ['/credit/loan/booking/multiple-disbursement'],
                                visible: this.menuGuardSrv.hideOrShow(['booking request'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Manual Fee'), icon: '', routerLink: ['/credit/loan-management/take-fee'],
                                visible: this.menuGuardSrv.hideOrShow(['manual fee'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Capture CRMS Code'), icon: '', routerLink: ['/credit/loan/loan-crms-update'],
                                visible: this.menuGuardSrv.hideOrShow(['crms-user'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Booking'), icon: '', routerLink: ['/credit/loan/booking'],
                                visible: this.menuGuardSrv.hideOrShow(['booking'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Contingents Release'), icon: '', routerLink: ['/credit/loan/contingent'],
                                visible: this.menuGuardSrv.hideOrShow(['bonds and guarantee'])
                            },

                            {
                                label: this.menuGuardSrv.translate('FX Account Setup'), icon: '', routerLink: ['/setup/charge/fx-account-creation'],
                                visible: this.menuGuardSrv.hideOrShow(['booking'])
                            },


                            {
                                label: this.menuGuardSrv.translate('Confirm Collateral Search'), icon: '', routerLink: ['/credit/legal-job-request-confirmation'],
                                visible: this.menuGuardSrv.hideOrShow(['confirm collateral search'])
                            },

                            {
                                label: this.menuGuardSrv.translate('Override Request'), icon: '', routerLink: ['/credit/loan/override'],
                                visible: this.menuGuardSrv.hideOrShow(['override request'])
                            },

                            {
                                label: this.menuGuardSrv.translate('Completed Loan Confirmation'), icon: '', routerLink: ['/credit/loan/completed-loan-confirmation'],
                                visible: this.menuGuardSrv.hideOrShow(['override request'])
                            },

                            {
                                label: this.menuGuardSrv.translate('Project Site Report'), icon: '', routerLink: ['/credit/project-site-report'],
                                visible: this.menuGuardSrv.hideOrShow(['Project Site Report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Approved Project Site Report'), icon: '', routerLink: ['/credit/project-site-report-account-officer'],
                                visible: this.menuGuardSrv.hideOrShow(['approved project site report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Credit Documentation'), icon: '', routerLink: ['/credit/loan/application/credit-documentation-los'],
                                visible: this.menuGuardSrv.hideOrShow(['credit documentation los'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Completed Credit Documentation'), icon: '', routerLink: ['/credit/loan/application/los-completed-credit-documentation'],
                                visible: this.menuGuardSrv.hideOrShow(['credit documentation los'])
                            },
                        ]
                    },
                    {
                        label: this.menuGuardSrv.translate('Credit Management'), icon: '',
                        visible: this.menuGuardSrv.hideOrShow([
                            'lms application',
                            'lms appraisal',
                            'lms generate offer letter',
                            'lms availment',
                            'loan operations',
                            'Bulk Loan Prepayment Reversal',
                            'Bulk Loan Prepayment',
                            'Loan Prepayment Reversal',
                            'overdraft operations',
                            'recovery operations',
                            'contingent operations',
                            'recovery payment plan',
                            'manual fee',
                            'prepayment',
                            'aps request',
                            'application route',
                            'reassign account',
                            'collateral information',
                            'collateral assignment',
                            ' covenant maintenance',
                            'risk assessment',
                            'facility detail summary',
                            'credit classification',
                            'fee charge change',
                            'maturity instruction',
                            'commercial loan rollover',
                            'commercial loan tenor extension',
                            'commercial loan sub-allocation',
                            'commercial loan rate review',
                            'commercial loan prepayment',
                            'committee secretariat',
                            'schedule simulation',
                            //'availmant route',
                            'collateral insurance request',
                            'Lc Cancellation',
                            'Lc Cancellation Approval',
                            'Lc Enhancement',
                            'Lc Enhancement Approval',
                            'Lc Extension',
                            'Lc Extension Approval',
                            'Lc Ussance Extension',
                            'Lc Ussance Extension Approval',
                            'credit documentation lms',
                            'modify lms application',
                            'credit documentation',
                            
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('Facility Detail Summary'), icon: '', routerLink: ['/credit/loan/facility-detail-summary'],
                                visible: this.menuGuardSrv.hideOrShow(['facility detail summary'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Letter Of Credit'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow(['Lc Cancellation',
                                                                        'Lc Enhancement',
                                                                        'Lc Enhancement Approval',
                                                                        'Lc Extension',
                                                                        'Lc Extension Approval',
                                                                        'Lc Cancellation Approval',
                                                                        'Lc Ussance Extension',
                                                                        'Lc Ussance Extension Approval',
                                ]),
                                items: [
                                    {
                                        label: this.menuGuardSrv.translate('LC LMS Search'), icon: '', routerLink: ['/credit/lc/search/lms'],
                                        visible: this.menuGuardSrv.hideOrShow(['Lc Cancellation',
                                                                            'Lc Enhancement',
                                                                            'Lc Enhancement Approval',
                                                                            'Lc Extension',
                                                                            'Lc Extension Approval',
                                                                            'Lc Cancellation Approval',
                                                                            'Lc Ussance Extension',
                                                                            'Lc Ussance Extension Approval',
                                                                            ])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('LC Cancellation'), icon: '', routerLink: ['/credit/lc/cancelation'],
                                        visible: this.menuGuardSrv.hideOrShow([
                                            'Lc Cancellation',
                                        ])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('LC Enhancement'), icon: '', routerLink: ['/credit/lc/enhancement'],
                                        visible: this.menuGuardSrv.hideOrShow(['Lc Enhancement'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('LC Issuance Extension'), icon: '', routerLink: ['/credit/lc/extension'],
                                        visible: this.menuGuardSrv.hideOrShow(['Lc Extension'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('LC Ussance Extension'), icon: '', routerLink: ['/credit/lc/ussance-extension'],
                                        visible: this.menuGuardSrv.hideOrShow(['Lc Ussance Extension'])
                                    }
                                ]
                            },
                            {
                                label: this.menuGuardSrv.translate('Application'), icon: '', routerLink: ['/credit/loan-review-approval/application'],
                                visible: this.menuGuardSrv.hideOrShow(['lms application'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Appraisal'), icon: '', routerLink: ['/credit/loan-review-approval/appraisal'],
                                visible: this.menuGuardSrv.hideOrShow(['lms appraisal'])
                            },
                            
                            {
                                label: this.menuGuardSrv.translate('Routing'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow([
                                    'application route',
                                    'availment route',
                                    'operation route',
                                ]),
                                items: [
                                    {
                                        label: this.menuGuardSrv.translate('Application Route'), icon: '', routerLink: ['/credit/appraisal/sla-monitoring'],
                                        visible: this.menuGuardSrv.hideOrShow(['application route'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Operation Route'), icon: '', routerLink: ['/credit/appraisal/operation-route'],
                                        visible: this.menuGuardSrv.hideOrShow(['operation route'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Availment Route'), icon: '', routerLink: ['/credit/appraisal/availment-route'],
                                        visible: this.menuGuardSrv.hideOrShow(['availment route'])
                                    },
                                ]
                            },
                            {
                                label: this.menuGuardSrv.translate('Application Review Search'), icon: '', routerLink: ['/credit/loan/loan-review-application-search'],
                                visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Contingent Application Search'), icon: '', routerLink: ['/credit/loan/loan-review-contingent-application-search'],
                                visible: this.menuGuardSrv.hideOrShow(['contingent application search'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Application Review Rejected'), icon: '', routerLink: ['/credit/loan/loan-review-application-rejected'],
                                visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Committee Secretariat'), icon: '', routerLink: ['/credit/loan/secretariat'],
                                visible: this.menuGuardSrv.hideOrShow(['committee secretariat'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Generate Offer Letter'), icon: '', routerLink: ['/credit/loan-review-approval/offer-letter'],
                                visible: this.menuGuardSrv.hideOrShow(['lms generate offer letter'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Availment'), icon: '', routerLink: ['/credit/loan-review-approval/availment'],
                                visible: this.menuGuardSrv.hideOrShow(['lms availment'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Capture CRMS Code'), icon: '', routerLink: ['/credit/loan-review-approval/lms-crms-update'],
                                visible: this.menuGuardSrv.hideOrShow(['crms-user'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Line Operations'), icon: '', routerLink: ['/credit/loan-management/facility-line-operations'],
                                visible: this.menuGuardSrv.hideOrShow(['facility-line-operations'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Bulk Loan Prepayment Reversal'), icon: '', routerLink: ['/credit/loan-management/bulk-loanprepaymentreversal'],
                                visible: this.menuGuardSrv.hideOrShow(['bulk liquidation'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Bulk Loan Prepayment'), icon: '', routerLink: ['/credit/loan-management/bulk-prepayment-loan'],
                                visible: this.menuGuardSrv.hideOrShow(['bulk liquidation'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Loan Prepayment Reversal'), icon: '', routerLink: ['/credit/loan-management/loan-prepayment-reversals'],
                                visible: this.menuGuardSrv.hideOrShow(['bulk liquidation'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Term Loan Operations'), icon: '', routerLink: ['/credit/loan-management/loan-review-operation'],
                                visible: this.menuGuardSrv.hideOrShow(['loan operations'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Commercial Loan Operations'), icon: '', routerLink: ['/credit/loan-management/commercial-loan-operations'],
                                visible: this.menuGuardSrv.hideOrShow(['commercial loan operations'])
                            },
                            // {
                            //     label: this.menuGuardSrv.translate('FX Revolving Loan Operations'), icon: '', routerLink: ['/credit/loan-management/fx-revolving-loan-operations'],
                            //     visible: this.menuGuardSrv.hideOrShow(['fx revolving loan operations'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Overdraft Operations'), icon: '', routerLink: ['/credit/loan-management/overdraft-operations'],
                                visible: this.menuGuardSrv.hideOrShow(['overdraft operations'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Recovery Operations'), icon: '', routerLink: ['/credit/loan-management/remedial-opreation'],
                                visible: this.menuGuardSrv.hideOrShow(['recovery operations'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Loan Recovery Payment'), icon: '', routerLink: ['/credit/loan-management/app-loan-recovery-payment'],
                                visible: this.menuGuardSrv.hideOrShow(['aps request'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Recovery'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow([
                                    'recovery operations',
                                ]),
                                
                                items: [
                                    {
                                        label: this.menuGuardSrv.translate('Recovery Agencies'), icon: '', routerLink: ['/credit/loan-management/accredited-consultant-list'],
                                        visible: this.menuGuardSrv.hideOrShow(['recovery operations'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('My Assigned Recoveries'), icon: '', routerLink: ['/credit/loan-management/recovery-assignment-list-internal-agents'],
                                        visible: this.menuGuardSrv.hideOrShow(['internal assigned recoveries'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Remedial Collections'), icon: '',
                                        visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial']),
                                        items: [
                                            
                                            {
                                                label: this.menuGuardSrv.translate('Recovery Assignment'), icon: '', routerLink: ['/credit/loan-management/assign-loan-to-agent'],
                                                visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial'])
                                            },
                                            {
                                                label: this.menuGuardSrv.translate('Assigned List'), icon: '', routerLink: ['/credit/loan-management/list-of-assigned-remedial-loans'],
                                                visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial'])
                                            },
                                            {
                                                label: this.menuGuardSrv.translate('Capture Recoveries'), icon: '', routerLink: ['/credit/loan-management/capture-liquidation-receipt'],
                                                visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial'])
                                            },
                                            {
                                                label: this.menuGuardSrv.translate('Recovery Reporting'), icon: '', routerLink: ['/credit/loan-management/recovery-reporting'],
                                                visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial'])
                                            },
                                            {
                                                label: this.menuGuardSrv.translate('Recovery Commission'), icon: '', routerLink: ['/credit/loan-management/recovery-commission'],
                                                visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial'])
                                            },
                                            {
                                                label: this.menuGuardSrv.translate('List Of written Loan'), icon: '', routerLink: ['/credit/loan-management/write-off-loans'],
                                                visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial'])
                                            },
                                        ],
                                        
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Retail Collections'), icon: '',
                                        visible: this.menuGuardSrv.hideOrShow(['recovery operations retail']),
                                        items: [
                                            {
                                                label: this.menuGuardSrv.translate('Recovery Assignment'), icon: '', routerLink: ['/credit/loan-management/assign-loan-to-agent-retail'],
                                                visible: this.menuGuardSrv.hideOrShow(['recovery operations retail'])
                                            },
                                            {
                                                label: this.menuGuardSrv.translate('Assigned List'), icon: '', routerLink: ['/credit/loan-management/list-of-assigned-retail-loans'],
                                                visible: this.menuGuardSrv.hideOrShow(['recovery operations retail'])
                                            },
                                            {
                                                label: this.menuGuardSrv.translate('Recovery Reporting'), icon: '', routerLink: ['/credit/loan-management/recovery-reporting-retail'],
                                                visible: this.menuGuardSrv.hideOrShow(['recovery operations retail'])
                                            },
                                            {
                                                label: this.menuGuardSrv.translate('Report Collection Internal'), icon: '', routerLink: ['/credit/loan-management/recovery-report-collection'],
                                                visible: this.menuGuardSrv.hideOrShow(['recovery operations retail'])
                                            },
                                            {
                                                label: this.menuGuardSrv.translate('Commission Internal'), icon: '', routerLink: ['/credit/loan-management/recovery-commission-internal'],
                                                visible: this.menuGuardSrv.hideOrShow(['recovery operations retail'])
                                            },
                                            {
                                                label: this.menuGuardSrv.translate('Commission External'), icon: '', routerLink: ['/credit/loan-management/recovery-commission-retail'],
                                                visible: this.menuGuardSrv.hideOrShow(['recovery operations retail'])
                                            },
                                            
                                        ],
                                        
                                    },
                                    
                                ],
                                
                            },
                            {
                                label: this.menuGuardSrv.translate('Contingent Liability'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow([
                                    'contingent operations',
                                ]),
                                items: [
                                    // {
                                    //     label: this.menuGuardSrv.translate('Contingent Appraisal Operations'), icon: '', routerLink: ['/credit/loan-management/contingent-operations'],
                                    //     visible: this.menuGuardSrv.hideOrShow(['contingent operations'])
                                    // },
                                    {
                                        label: this.menuGuardSrv.translate('Contingent Operations'), icon: '', routerLink: ['/credit/loan-management/contingent-liability-terminate-rebook'],
                                        visible: this.menuGuardSrv.hideOrShow(['contingent operations'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Expired Contingents'), icon: '', routerLink: ['/credit/loan-management/contingent-termination'],
                                        visible: this.menuGuardSrv.hideOrShow(['contingent operations'])
                                    },
                                    {
                                        label: this.menuGuardSrv.translate('Cancel In-Active Contingents'), icon: '', routerLink: ['/credit/loan-management/cancel-contingent-liability'],
                                        visible: this.menuGuardSrv.hideOrShow(['contingent operations'])
                                    },
                                ]
                            },
                            {
                                label: this.menuGuardSrv.translate('Manual Fee'), icon: '', routerLink: ['/credit/loan-management/take-fee'],
                                visible: this.menuGuardSrv.hideOrShow(['manual fee'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Global Interest Rate Change'), icon: '', routerLink: ['/credit/loan-management/global-interest-rate-change'],
                                visible: this.menuGuardSrv.hideOrShow(['global interest rate change'])
                            },
                            // {
                            //     label: this.menuGuardSrv.translate('Bulk Liquidation'), icon: '', routerLink: ['/credit/loan-management/bulk-loanprepaymentreversal'],
                            //     visible: this.menuGuardSrv.hideOrShow(['bulk liquidation'])
                            // },
                            // {
                            //     label: this.menuGuardSrv.translate('Recovery Payment Plan'), icon: '', routerLink: ['/credit/loan-management/LoanRecoveryPaymentPlan'],
                            //     visible: this.menuGuardSrv.hideOrShow(['recovery payment plan'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Prepayment'), icon: '', routerLink: ['/credit/loan-management/loan-prepayment'],
                                visible: this.menuGuardSrv.hideOrShow(['prepayment'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Loan Termination'), icon: '', routerLink: ['/credit/loan-management/loan-termination'],
                                visible: this.menuGuardSrv.hideOrShow(['termination'])
                            },
                            // {
                            //     label: this.menuGuardSrv.translate('CP/FX Loan Prepayment'), icon: '', routerLink: ['/credit/loan-management/commercial-loans/cp-prepayment'],
                            //     visible: this.menuGuardSrv.hideOrShow(['commercial loan prepayment'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Loan Fee Adjustment'), icon: '', routerLink: ['/credit/loan-management/loan-fee-adjustment'],
                                visible: this.menuGuardSrv.hideOrShow(['loan operations'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Loan Classification'), icon: '', routerLink: ['/credit/loan-management/loan-performance'],
                                visible: this.menuGuardSrv.hideOrShow(['loan operations'])
                            },
                            {
                                label: this.menuGuardSrv.translate('APS Request'), icon: '', routerLink: ['/credit/loan/contingent-usage-list'],
                                visible: this.menuGuardSrv.hideOrShow(['aps request'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Reassign Account'), icon: '', routerLink: ['/credit/loan/reassign-account'],
                                visible: this.menuGuardSrv.hideOrShow(['reassign account'])
                            },
                            

                            {
                                label: this.menuGuardSrv.translate(' Covenant Maintenance'), icon: '', routerLink: ['/credit/loan-covenant/covenant-detail'],
                                visible: this.menuGuardSrv.hideOrShow([' covenant maintenance'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Risk Assessment'), icon: '', routerLink: ['/credit/risk/risk-assessment'],
                                visible: this.menuGuardSrv.hideOrShow(['risk assessment'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Facility Line Information'), icon: '', routerLink: ['/credit/loan/facility-details/tranche-facility-utilization'],
                                visible: this.menuGuardSrv.hideOrShow(['booking request'])
                            }, {
                                label: this.menuGuardSrv.translate('Completed Loan Confirmation'), icon: '', routerLink: ['/credit/loan/completed-loan-confirmation'],
                                visible: this.menuGuardSrv.hideOrShow(['override request'])
                            },


                            {
                                label: this.menuGuardSrv.translate('Full And Final Complete Write-off'), icon: '', routerLink: ['/credit/loan/full-and-final-status-change'],
                                visible: this.menuGuardSrv.hideOrShow(['full and final writeoff'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Credit Documentation'), icon: '',
                                visible: this.menuGuardSrv.hideOrShow(['credit documentation lms','credit documentation']),
                                    items: [
                                        {
                                            label: this.menuGuardSrv.translate('Credits'), icon: '', routerLink: ['/credit/loan/application/credit-documentation'],
                                            visible: this.menuGuardSrv.hideOrShow(['credit documentation lms'])
                                        },
                                        {
                                            label: this.menuGuardSrv.translate('Completed Credit Documentation'), icon: '', routerLink: ['/credit/loan/application/lms-completed-credit-documentation'],
                                            visible: this.menuGuardSrv.hideOrShow(['credit documentation lms'])
                                        },
                                        {
                                            label: this.menuGuardSrv.translate('Related Processes Documentation'), icon: '', routerLink: ['/credit/loan/application/related-documentation'],
                                            visible: this.menuGuardSrv.hideOrShow(['credit documentation'])
                                        }
                                    ]
                            },
                            {
                                label: this.menuGuardSrv.translate('Modify Facility'), icon: '', routerLink: ['/credit/loan/application/modify-lms-application'],
                                visible: this.menuGuardSrv.hideOrShow(['modify lms application'])
                            },
                            

                            // {
                            //     label: this.menuGuardSrv.translate('Commercial Loans'), icon: '',
                            //     visible: this.menuGuardSrv.hideOrShow([
                            //         'maturity instruction',
                            //         'commercial loan rollover',
                            //         'commercial loan tenor extension',
                            //         'commercial loan sub-allocation',
                            //         'commercial loan rate review',
                            //         'commercial loan prepayment',
                            //     ]),
                            //     items: [
                            //         {
                            //             label: this.menuGuardSrv.translate('Maturity Instruction'), icon: '', routerLink: ['/credit/loan-management/commercial-loans/maturity-instruction'],
                            //             visible: this.menuGuardSrv.hideOrShow(['maturity instruction'])
                            //         },
                            //         {
                            //             label: this.menuGuardSrv.translate('Rollover'), icon: '', routerLink: ['/credit/loan-management/commercial-loans/cp-rollover'],
                            //             visible: this.menuGuardSrv.hideOrShow(['commercial loan rollover'])
                            //         },
                            //         {
                            //             label: this.menuGuardSrv.translate('Tenor Extension'), icon: '', routerLink: ['/credit/loan-management/commercial-loans/cp-tenor-extension'],
                            //             visible: this.menuGuardSrv.hideOrShow(['commercial loan tenor extension'])
                            //         },
                            //         {
                            //             label: this.menuGuardSrv.translate('Rate Review'), icon: '', routerLink: ['/credit/loan-management/commercial-loans/cp-interest-rate-review'],
                            //             visible: this.menuGuardSrv.hideOrShow(['commercial loan rate review'])
                            //         },
                            //         {
                            //             label: this.menuGuardSrv.translate('Sub-Allocation'), icon: '', routerLink: ['/credit/loan-management/commercial-loans/cp-sub-allocation'],
                            //             visible: this.menuGuardSrv.hideOrShow(['commercial loan sub-allocation'])
                            //         },
                            //         {
                            //             label: this.menuGuardSrv.translate('Loan Prepayment'), icon: '', routerLink: ['/credit/loan-management/commercial-loans/cp-prepayment'],
                            //             visible: this.menuGuardSrv.hideOrShow(['commercial loan prepayment'])
                            //         },
                            //     ]
                            // },
                            // {
                            //     label: this.menuGuardSrv.translate('Credit Classification'), icon: '', routerLink: ['#'],
                            //     visible: this.menuGuardSrv.hideOrShow(['credit classification'])
                            // },
                            // {
                            //     label: this.menuGuardSrv.translate('Fee Charge Change'), icon: '', routerLink: ['#'],
                            //     visible: this.menuGuardSrv.hideOrShow(['fee charge change'])
                            // },
                        ]
                    },
                    {
                        label: this.menuGuardSrv.translate('Collateral'), icon: '',
                        visible: this.menuGuardSrv.hideOrShow([
                            'collateral information',
                            'collateral assignment',
                            'collateral insurance request',
                            'collateral policy approval',
                            'collateral swap',
                            'collateral swap approval'
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('Collateral Information'), icon: '', routerLink: ['/credit/collateral/collateral-information'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral information'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Swap'), icon: '', routerLink: ['/credit/collateral/collateral-swap'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral swap'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Swap Search'), icon: '', routerLink: ['/credit/collateral/collateral-swap-search'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral swap', 'collateral swap approval'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Information Release'), icon: '', routerLink: ['/credit/collateral/collateral-information-release'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral information'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Release Job Request'), icon: '', routerLink: ['/credit/collateral/collateral-release-awaiting-job-request'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral information'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Release'), icon: '', routerLink: ['/credit/collateral/collateral-assignment'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral assignment'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Valuation'), icon: '', routerLink: ['/credit/loan/collateral-valuation'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral valuation'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Valuation Search'), icon: '', routerLink: ['/credit/loan/collateral-valuation-search'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral valuation search'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Insurance Request'), icon: '', routerLink: ['/credit/loan/collateral-insurance-request'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral insurance request'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Insurance Search'), icon: '', routerLink: ['/credit/loan/collateral-insurance-search'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral insurance request',
                                                                        'collateral policy approval'])
                            },
                        ]
                    },
                    {
                        label: this.menuGuardSrv.translate('Original Document Submission'), icon: '', routerLink: ['/credit/loan/original-document-submission'],
                        visible: this.menuGuardSrv.hideOrShow(['Original Document'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Original Document Search'), icon: '', routerLink: ['/credit/original-document-submission-search'],
                        visible: this.menuGuardSrv.hideOrShow(['original document search'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Security Release'), icon: '', routerLink: ['/credit/loan/security-release'],
                        visible: this.menuGuardSrv.hideOrShow(['security release'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Cash Security Release'), icon: '', routerLink: ['/credit/loan/cash-security-release'],
                        visible: this.menuGuardSrv.hideOrShow(['security release'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Security Release Search'), icon: '', routerLink: ['/credit/security-release-search'],
                        visible: this.menuGuardSrv.hideOrShow(['security release search'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Cash Security Release Search'), icon: '', routerLink: ['/credit/cash-security-release-search'],
                        visible: this.menuGuardSrv.hideOrShow(['security release search'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Written-off Accounts/Black-Book'), icon: '', routerLink: ['/credit/risk/loan-camsol'],
                        visible: this.menuGuardSrv.hideOrShow(['risk assessment'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Deferral Management'), icon: '', routerLink: ['/credit/loan/application/deferral-management'],
                        visible: this.menuGuardSrv.hideOrShow(['deferral management'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Consumer Protection'), icon: '', routerLink: ['/credit/loan/application/consumer-protection'],
                        visible: this.menuGuardSrv.hideOrShow(['consumer protection'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Related Employer'), icon: '', routerLink: ['/credit/loan/application/related-employer'],
                        visible: this.menuGuardSrv.hideOrShow(['related employer'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Lien Management'), icon: '',
                        visible: this.menuGuardSrv.hideOrShow([
                            'lien management',
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('Add Lien'), icon: '', routerLink: ['/credit/loan/application/lien-customer-account'],
                                visible: this.menuGuardSrv.hideOrShow(['lien management'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Release Lien'), icon: '', routerLink: ['/credit/loan-management/unfreeze-overdraft-lien'],
                                visible: this.menuGuardSrv.hideOrShow(['lien management'])
                            },
                        ]
                    },
                    
                    
                    {
                        label: this.menuGuardSrv.translate('Repayment Schedule Simulation'), icon: '', routerLink: ['/credit/loan/schedule'],
                        visible: this.menuGuardSrv.hideOrShow(['schedule simulation'])
                    },
                ]
            },
            {
                label: this.menuGuardSrv.translate('Call Memo'), icon: 'assignment', routerLink: ['/credit/loan/call-memo'],
                visible: this.menuGuardSrv.hideOrShow(['call memo'])
            },
            {
                label: this.menuGuardSrv.translate('Reports'), icon: 'timeline',
                visible: this.menuGuardSrv.hideOrShow([
                    'repayment schedule',
                    'disbursement',
                    'disbursal credit turnover',
                    'statement',
                    'anniversary',
                    'loan status report',
                    'waivers',
                    'deferred',
                    'waived',
                    'deferrals',
                    'deferrals for mcc',
                    'scheduled fcy credit',
                    'collateral report',
                    'workflow definition report',
                    'turn around time report',
                    'posted transaction report',
                    'branch npl limit report',
                    'sectorial limit report',
                    'collateral revaluation report',
                    'covenant report',
                    'npl report',
                    'expired overdraft report',
                    'reports',
                    'insider related loans',
                   
                ]),
                items: [
                    {
                        label: this.menuGuardSrv.translate('Credit Monitoring'), icon: '', visible: this.menuGuardSrv.hideOrShow([
                            'credit monitoring report'
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('Credit Monitoring Report'), icon: '', routerLink: ['/admin/credit-monitoring-report'],
                                visible: this.menuGuardSrv.hideOrShow(['credit monitoring report'])
                            },
                            
                        ]
                    },

                    {
                        label: this.menuGuardSrv.translate('Audit Trail'), icon: '', visible: this.menuGuardSrv.hideOrShow([
                            'audit trail report'
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('System Audit Trail'), icon: '', routerLink: ['/report/admin/audit-trail-report'],
                                visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Logging Status'), icon: '', routerLink: ['/report/admin/logging-status'],
                                visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Staff Privilege Change'), icon: '', routerLink: ['/report/staff/staff-privilege-change'],
                                visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('User Group Change'), icon: '', routerLink: ['/report/staff/user-group-change-report'],
                                visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Profile Activity'), icon: '', routerLink: ['/report/staff/profile-activity-report'],
                                visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Staff Role Profile Group'), icon: '', routerLink: ['/report/staff/staff-role-profile-group-report'],
                                visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Staff Role Profile Activity'), icon: '', routerLink: ['/report/staff/staff-role-profile-activity-report'],
                                visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                            }
                            
                        ]
                    },
                    {
                        label: this.menuGuardSrv.translate('Credit'), icon: '', visible: this.menuGuardSrv.hideOrShow([
                            'repayment schedule',
                            'disbursement',
                            'statement',
                            'anniversary',
                            'loan status report',
                            'waivers',
                            'deferred',
                            'waived',
                            'deferrals',
                            'deferrals for mcc',
                            'scheduled fcy credit',
                            'collateral report',
                            
                        
                        ]),
                         items: [
                    //         {
                    //             label: this.menuGuardSrv.translate('Repayment Schedule'), icon: '', routerLink: ['/report/loan-details/loan-schedule'],
                    //             visible: this.menuGuardSrv.hideOrShow(['repayment schedule'])
                    //         },
                            {
                                label: this.menuGuardSrv.translate('Disbursement'), icon: '', routerLink: ['/report/loan-details/loan-disburstment'],
                                visible: this.menuGuardSrv.hideOrShow(['disbursement'])
                            },

                            {
                                label: this.menuGuardSrv.translate('Running Facilities'), icon: '', routerLink: ['/report/loan-details/running-facilities'],
                                visible: this.menuGuardSrv.hideOrShow(['running facilities'])
                            },

                    //         {
                    //             label: this.menuGuardSrv.translate('Middle Office'), icon: '', routerLink: ['/report/loan-details/middle-office-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['middle office report'])
                    //         },
                            {
                                label: this.menuGuardSrv.translate('Collateral Valuation'), icon: '', routerLink: ['/report/loan-details/collateral-valuation-report'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral valuation report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Credit Schedule'), icon: '', routerLink: ['/report/loan-details/credit-schedule-report'],
                                visible: this.menuGuardSrv.hideOrShow(['credit schedule report'])
                            },

                            {
                                label: this.menuGuardSrv.translate('In Active Contigent Liability'), icon: '', routerLink: ['/report/loan-details/in-active-contigent-liability-report'],
                                visible: this.menuGuardSrv.hideOrShow(['inActive Contigent Liability'])
                            },
                                {
                                    label: this.menuGuardSrv.translate('Loan Statement'), icon: '', routerLink: ['/report/loan/loan-statement'],
                                    visible: this.menuGuardSrv.hideOrShow(['statement'])
                                },
                            {
                                label: this.menuGuardSrv.translate('Loan Status Report'),
                                icon: '',
                                routerLink: ['/report/loan-status-report'],
                                visible: this.menuGuardSrv.hideOrShow(['Loan Status Report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('TAT Report'), icon: '', routerLink: ['/report/turn-around-time'],
                                visible: this.menuGuardSrv.hideOrShow(['statement'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Credit Turnover'), icon: '', routerLink: ['/report/loan/disbursal-credit-turnover'],
                                visible: this.menuGuardSrv.hideOrShow(['statement'])
                            },
                                {
                                    label: this.menuGuardSrv.translate('Anniversary'), icon: '', routerLink: ['/report/loan/loan-LoanAnniversery'],
                                    visible: this.menuGuardSrv.hideOrShow(['anniversary'])
                                },
                            {
                                label: this.menuGuardSrv.translate('Waivers'), icon: '', routerLink: ['/report/loan/loan-document-waived'],
                                visible: this.menuGuardSrv.hideOrShow(['waived'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Deferals'), icon: '', routerLink: ['/report/loan/loan-document-deferred'],
                                visible: this.menuGuardSrv.hideOrShow(['deferred'])
                            },
                    //         //  {
                    //         // label: this.menuGuardSrv.translate('Deferrals'), icon: '', routerLink: ['/report/loan/loan-deferral'],
                    //         //visible: this.menuGuardSrv.hideOrShow(['deferrals'])
                    //         //},
                    //         {
                    //             label: this.menuGuardSrv.translate('Deferrals For MCC'), icon: '', routerLink: ['/report/loan/loan-deferral-mcc'],
                    //             visible: this.menuGuardSrv.hideOrShow(['deferrals for mcc'])
                    //         },
                            {
                                label: this.menuGuardSrv.translate('Scheduled FCY Credit'), icon: '', routerLink: ['/report/loan/loan-fcyscheuled'],
                                visible: this.menuGuardSrv.hideOrShow(['scheduled fcy credit'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral'), icon: '', routerLink: ['/report/loan/collateral-estimated'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                            },

                            {
                                label: this.menuGuardSrv.translate('Booking Report'), icon: '', routerLink: ['/report/loan/loan-booking-report'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                            },
                    //         {
                    //             label: this.menuGuardSrv.translate('Form300b-Facilities'), icon: '', routerLink: ['/report/loan/form300b-facility-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Submission of Original Document'), icon: '', routerLink: ['/report/loan/original-document-submission'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Risk Assets Report'), icon: '', routerLink: ['/report/risk-assets-report/risk-assets-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Contigent Report'), icon: '', routerLink: ['/report/contigent-report/contigent-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                            // {
                            //     label: this.menuGuardSrv.translate('Expired Facility report'), icon: '', routerLink: ['/report/expired-Facility-report/expired-Facility-report'],
                            //     visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                            // },
                    //         {
                    //             label: this.menuGuardSrv.translate('Large Exposure report'), icon: '', routerLink: ['/report/large-exposure-report/large-exposure-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Overline Report'), icon: '', routerLink: ['/report/overline-report/overline-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                            {
                                label: this.menuGuardSrv.translate('Extension Report'), icon: '', routerLink: ['/report/extension-report/extension-report'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Employer Related Report'), icon: '', routerLink: ['/report/employer-related'],
                                visible: this.menuGuardSrv.hideOrShow(['report'])
                            },
                    //         {
                    //             label: this.menuGuardSrv.translate('Maturity Report'), icon: '', routerLink: ['/report/maturity-report/maturity-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Unpaid Obligation Report'), icon: '', routerLink: ['/report/unpaid-obligation-report/unpaid-obligation-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Risk Asset Team Report'), icon: '', routerLink: ['/report/risk-asset-team-report/risk-asset-team-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Risk Asset Main Report'), icon: '', routerLink: ['/report/risk-asset-main-report/risk-asset-main-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Risk Asset Main Report_1'), icon: '', routerLink: ['/report/risk-asset-main1-report/risk-asset-main1-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Risk Asset By Variance Report'), icon: '', routerLink: ['/report/risk-asset-by-variance-report/risk-asset-by-variance-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Risk Asset Distribution By Sector Report'), icon: '', routerLink: ['/report/risk-asset-distribution-by-sector-report/risk-asset-distribution-by-sector-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Risk Asset By IFRS Classification Report'), icon: '', routerLink: ['/report/risk-asset-by-ifrs-classification-report/risk-asset-by-ifrs-classification-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('IFRS Classification Team Report'), icon: '', routerLink: ['/report/ifrs-classification-team-report/ifrs-classification-team-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Cbn Npl Team Report'), icon: '', routerLink: ['/report/cbn-npl-team-report/cbn-npl-team-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                            
                    //         {
                    //             label: this.menuGuardSrv.translate('Contigent Liability Report Main'), icon: '', routerLink: ['/report/contigent-liabilty-report-main-report/contigent-liabilty-report-main-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Contigent Liability Report'), icon: '', routerLink: ['/report/contigent-liabilty/contigent-liabilty'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         }, 
                            
                    //         {
                    //             label: this.menuGuardSrv.translate('Contigent Liability Report Main1 Report'), icon: '', routerLink: ['/report/contigent-liabilty-report-main1/contigent-liabilty-report-main1'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Copy Of Risk Asset Main'), icon: '', routerLink: ['/report/copy-of-risk-asset-main-report/copy-of-risk-asset-main-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Copy Of Risk Asset By IFRS Classification'), icon: '', routerLink: ['/report/copy-of-risk-asset-by-ifrs-classification/copy-of-risk-asset-by-ifrs-classification'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                            
                    //         {
                    //             label: this.menuGuardSrv.translate('Risk Asset Combined Report'), icon: '', routerLink: ['/report/risk-asset-combined-report/risk-asset-combined-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Risk Asset Calc Combined Report Team'), icon: '', routerLink: ['/report/calc-combine/calc-combine'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },

                    //         {
                    //             label: this.menuGuardSrv.translate('Risk Asset Calc Combined Report'), icon: '', routerLink: ['/report/risk-calc-combine/risk-calc-combine'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Risk Asset By Npl Classification'), icon: '', routerLink: ['/report/risk-asset-by-cbn-classification-report/risk-asset-by-cbn-classification-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },
                    //         {
                    //             label: this.menuGuardSrv.translate('Risk Asset Contigent Report Main'), icon: '', routerLink: ['/report/risk-asset-contigent-report-main/risk-asset-contigent-report-main'],
                    //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                    //         },

                           
                         ]
                     },
                    {
                        label: this.menuGuardSrv.translate('Approval Workflow'), icon: '', visible: this.menuGuardSrv.hideOrShow([
                            'workflow definition report',
                             'turn around time report',
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('Workflow Definition'), icon: '', routerLink: ['/report/Workflow/definition'],
                                visible: this.menuGuardSrv.hideOrShow(['workflow definition report'])
                            },
                            // {
                            //     label: this.menuGuardSrv.translate('Workflow SLA'), icon: '', routerLink: ['/report/loan-workflow/application-sla'],
                            //     visible: this.menuGuardSrv.hideOrShow(['turn around time report'])
                            // },
                            // {
                            //     label: this.menuGuardSrv.translate('SLA Monitoring'), icon: '', routerLink: ['/report/loan-workflow/sla-monitoring'],
                            //     visible: this.menuGuardSrv.hideOrShow(['turn around time report'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Approval Monitoring'), icon: '', routerLink: ['/report/approval-monitoring'],
                                visible: this.menuGuardSrv.hideOrShow(['turn around time report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('TAT Report'), icon: '', routerLink: ['/report/turn-around-time'],
                                visible: this.menuGuardSrv.hideOrShow(['statement'])
                            }
                        ]
                    },
                    {
                        label: this.menuGuardSrv.translate('LOS CRMS Regulatory'), icon: '', routerLink: ['/credit/newloan/crms'],
                        visible: this.menuGuardSrv.hideOrShow(['start credit application'])
                    },
                    
                    {
                        label: this.menuGuardSrv.translate('LMS CRMS Regulatory'), icon: '', routerLink: ['/credit/newloan/lms-crms'],
                        visible: this.menuGuardSrv.hideOrShow(['start credit application'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Posted Transaction'), icon: '', routerLink: ['/report/finance/posted-transaction'],
                        visible: this.menuGuardSrv.hideOrShow(['posted transaction report'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Daily Interest Accrual'), icon: '', routerLink: ['/report/finance/daily-interest-accrual'],
                        visible: this.menuGuardSrv.hideOrShow(['posted transaction report'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Loan Repayment'), icon: '', routerLink: ['/report/finance/loan-repayment'],
                        visible: this.menuGuardSrv.hideOrShow(['posted transaction report'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Custom Facility Repayment'), icon: '', routerLink: ['/report/finance/custom-factility-repayment'],
                        visible: this.menuGuardSrv.hideOrShow(['posted transaction report'])
                    },
                    {
                        label: this.menuGuardSrv.translate('Monitoring'), icon: '', visible: this.menuGuardSrv.hideOrShow([
                            // 'branch npl limit report',
                            // 'sectorial limit report',
                            // 'collateral revaluation report',
                            // 'covenant report',
                            'npl report',
                            // 'expired overdraft report',
                            'reports',
                        ]),
                        items: [
                            // {
                            //     label: this.menuGuardSrv.translate('Branch NPL'), icon: '', routerLink: ['/report/loan-Limit-monitoring/branch-limit'],
                            //     visible: this.menuGuardSrv.hideOrShow(['branch npl limit report'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Credit Analyst Report'), icon: '', routerLink: ['/report/analyst-report'],
                                visible: this.menuGuardSrv.hideOrShow(['analyst report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Job request Report'), icon: '', routerLink: ['/report/job-request-report'],
                                visible: this.menuGuardSrv.hideOrShow(['job request report'])
                            },    
                            {
                                label: this.menuGuardSrv.translate('Sector Limit'), icon: '', routerLink: ['/report/loan-Limit-monitoring/sectorial-limit'],
                                visible: this.menuGuardSrv.hideOrShow(['sectorial limit report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Revaluation'), icon: '',
                                routerLink: ['/report/loan-monitoring/collateral-property-revaluation'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral revaluation report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Covenants'), icon: '', routerLink: ['/report/loan-monitoring/almost-due-covenants'],
                                visible: this.menuGuardSrv.hideOrShow(['covenant report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('NPL'), icon: '', routerLink: ['/report/loan-monitoring/non-performing-loans'],
                                visible: this.menuGuardSrv.hideOrShow(['npl report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Expired Overdraft'), icon: '',
                                routerLink: ['/report/loan-monitoring/expired-overdraft-loans'],
                                visible: this.menuGuardSrv.hideOrShow(['expired overdraft report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Corporate Loans Report'),
                                icon: '',
                                routerLink: ['/report/corporate-loans-report'],
                                visible: this.menuGuardSrv.hideOrShow(['corporate loans report'])
                            },
                                {
                                    label: this.menuGuardSrv.translate('Insider Related Loans'), icon: '',
                                    routerLink: ['/report/loan-monitoring/insider-related-loans'],
                                    visible: this.menuGuardSrv.hideOrShow(['insider related loans'])
                                },
                            // {
                            //     label: this.menuGuardSrv.translate('Expired FTS'), icon: '',
                            //     routerLink: ['/report/loan/expired-stakeholder-with-pnd'],
                            //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Credit Bureau'), icon: '',
                                routerLink: ['/report/loan-monitoring/credit-bureau'],
                                visible: this.menuGuardSrv.hideOrShow(['Credit Bureau report'])
                            },
                            //         {
                            //             label: this.menuGuardSrv.translate('Bonds & Guarantee'), icon: '',
                            //             routerLink: ['/report/loan/bond-and-guarantee'],
                            //             visible: this.menuGuardSrv.hideOrShow(['reports'])
                            //         },

                            {
                                    label: this.menuGuardSrv.translate('Bonds & Guarantee'), icon: '',
                                    routerLink: ['/report/loan/bond-and-guarantee-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Contingents Report'), icon: '',
                                routerLink: ['/report/loan/contingents-report'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Due For Visitation'), icon: '',
                                routerLink: ['/report/loan/collateral-visitation'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Expired Collateral Insurance'), icon: '',
                                routerLink: ['/report/loan/insurance-expiration'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Turnover Covenant'), icon: '',
                                routerLink: ['/report/loan/turnover-covenant'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                    //         {
                    //             label: this.menuGuardSrv.translate('Self Liquidating Loan'), icon: '',
                    //             routerLink: ['/report/loan/expired-self-liquidating-loans'],
                    //             visible: this.menuGuardSrv.hideOrShow(['reports'])
                    //         },
                            {
                                label: this.menuGuardSrv.translate('Blacklist'), icon: '',
                                routerLink: ['/report/loan/blacklist'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Lien'), icon: '',
                                routerLink: ['/report/loan/lien'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Stalled Perfection For Collaterals'), icon: '',
                                routerLink: ['/report/loan/stalled-perfection-report'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Perfection Yet to Commence'), icon: '',
                                routerLink: ['/report/loan/collateral-perfection-yettocommence'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Perfection'), icon: '',
                                routerLink: ['/report/loan/collateral-perfection'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral perfection report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Register'), icon: '',
                                routerLink: ['/report/loan/collateral-register'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral register report'])
                            },
                    //         {
                    //             label: this.menuGuardSrv.translate('All Commercial Loan Report'), icon: '',
                    //             routerLink: ['/report/loan/all-comercial-loan-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['reports'])
                    //         },
                            {
                                label: this.menuGuardSrv.translate('Loan Classification Report'), icon: '',
                                routerLink: ['/report/loan/loan-classification-report'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Trial Balance Report'), icon: '',
                                routerLink: ['/report/loan/trial-balance-report'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },

                            {
                                label: this.menuGuardSrv.translate('Interest Income Report'), icon: '',
                                routerLink: ['/report/loan/interest-income'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Age Analysis Report'), icon: '',
                                routerLink: ['/report/loan/age-analysis-report'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },

                            {
                                label: this.menuGuardSrv.translate('Runining Loan Report'), icon: '',
                                routerLink: ['/report/loan/runining-loan-report'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },

                            // {
                            //     label: this.menuGuardSrv.translate('Impaired WatchList Report'), icon: '',
                            //     routerLink: ['/report/loan/impaired-watch-list-report'],
                            //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Insurance Report'), icon: '',
                                routerLink: ['/report/loan/insurance-report'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            // {
                            //     label: this.menuGuardSrv.translate('Excess Report'), icon: '',
                            //     routerLink: ['/report/loan/excess-report'],
                            //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Unutilized Facility Report'), icon: '',
                                routerLink: ['/report/loan/unutilized-facility-report'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },

                    //         {
                    //             label: this.menuGuardSrv.translate('Expired Report'), icon: '',
                    //             routerLink: ['/report/loan/expired-report'],
                    //             visible: this.menuGuardSrv.hideOrShow(['reports'])
                    //         },
                            // {
                            //     label: this.menuGuardSrv.translate('Sanction Limit Report'), icon: '',
                            //     routerLink: ['/report/loan/sanction-limit-report'],
                            //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                            // },

                            {
                                label: this.menuGuardSrv.translate('Unearned and Receivable Interest Report'), icon: '',
                                routerLink: ['/report/loan/unearned-interest-Report'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            // {
                            //     label: this.menuGuardSrv.translate('CashBacked Facility For OD And Loans Report'), icon: '',
                            //     routerLink: ['/report/loan/cashbacked-Report'],
                            //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                            // },

                            // {
                            //     label: this.menuGuardSrv.translate('CashBack Bond Guarantee'), icon: '',
                            //     routerLink: ['/report/loan/cashbacked-bond-guarantee'],
                            //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                            // },
                            {
                                label: this.menuGuardSrv.translate('Weekly Recovery Report FINCON'), icon: '',
                                routerLink: ['/report/loan/weeklyrecovery-Reportfor-FINCON'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Cash Collaterized Credits'), icon: '',
                                routerLink: ['/report/loan/cash-collaterized-credits'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            }

                        ]
                    },

                    {
                        label: this.menuGuardSrv.translate('Remedial Asset Reports'), icon: '', visible: this.menuGuardSrv.hideOrShow([
                            'reports'
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('Out Of Court Settlement'), icon: '', routerLink: ['/report/out-of-court-settlement/out-of-court-settlement'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Collateral Sales'), icon: '', routerLink: ['/report/collateral-sales/collateral-sales'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Recovery Agent Update'), icon: '', routerLink: ['/report/recovery-agent-update/recovery-agent-update'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Recovery Commission'), icon: '', routerLink: ['/report/recovery-commission/recovery-commission'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Recovery Agent Performance'), icon: '', routerLink: ['/report/recovery-agent-performance/recovery-agent-performance'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Litigation Recoveries'), icon: '', routerLink: ['/report/litigation-recoveries/litigation-recoveries'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Revalidation Of Full & Final Settlement'), icon: '', routerLink: ['/report/revalidation-of-full-and-final-settlement/revalidation-of-full-and-final-settlement'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Idle Assets Sales'), icon: '', routerLink: ['/report/idle-assets-sales/idle-assets-sales'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Full & Final Settlement & Waivers'), icon: '', routerLink: ['/report/full-and-final-settlement-and-waivers/full-and-final-settlement-and-waivers'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            }
                        ]
                    },

                    {
                        label: this.menuGuardSrv.translate('Retail Collection Reports'), icon: '',
                        visible: this.menuGuardSrv.hideOrShow(['reports']),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('Delinquent Accounts'), icon: '', routerLink: ['/report/recovery-delinquent-accounts/recovery-delinquent-accounts'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },

                            {
                                label: this.menuGuardSrv.translate('Payday Loan Allocation'), icon: '', routerLink: ['/report/payday-loan-allocation/payday-loan-allocation'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Computation External Agents'), icon: '', routerLink: ['/report/computation-for-external-agents/computation-for-external-agents'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Computation Internal Agents'), icon: '', routerLink: ['/report/computation-for-internal-agents/computation-for-internal-agents'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Recovery Collections Report'), icon: '', routerLink: ['/report/recovery-collections-report/recovery-collections-report'],
                                visible: this.menuGuardSrv.hideOrShow(['reports'])
                            },
                        ],
                    },

                    {
                        label: this.menuGuardSrv.translate('Collateral Reports'), icon: '', visible: this.menuGuardSrv.hideOrShow([
                            'reports'
                        ]),
                        items: [
                            {
                                label: this.menuGuardSrv.translate('Fixed Deposit'), icon: '', routerLink: ['/report/loan/fixed-deposit-collateral'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                            },
                            {
                                label: this.menuGuardSrv.translate('Valid Collaterals'), icon: '', routerLink: ['/report/loan/valid-collateral'],
                                visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                            },
                        ]
                    },
                    

                ]
            }

        ];

    }

    // getCountryCurrency() {
    //     this.dashboard.getCountryCurrency().subscribe(response => {
    //             this.currCode = response.result;
    //             console.log(this.currCode.countryCode);
    //             });
    // }


    // getTranslatedLabel(): string {
    //         if (this.currCode.countryCode == 'GHS') {
    //             return this.menuGuardSrv.translate('Region');
    //         } else {
    //             return this.menuGuardSrv.translate('State');
    //         };
    // }

    getCountryCurrency() {
        this.dashboard.getCountryCurrency().subscribe(response => {
          this.currCode = response.result;
          this.getRegionNameLabel(); // Call the getRegionNameLabel() function here once currCode is set.
          this.getSubRegionNameLabel(); // Call the getSubRegionNameLabel() function here once currCode is set.
        });
      }
      
      getRegionNameLabel(): string {
        if (this.currCode && this.currCode.countryCode == 'GHS') { // Add a check to ensure currCode is not undefined before accessing its properties.
          return this.menuGuardSrv.translate('Region');
        } else {
          return this.menuGuardSrv.translate('State');
        }
      }

      getSubRegionNameLabel(): string {
        if (this.currCode && this.currCode.countryCode == 'GHS') { // Add a check to ensure currCode is not undefined before accessing its properties.
          return this.menuGuardSrv.translate('MMDA');
        } else {
          return this.menuGuardSrv.translate('Local Govt');
        }
      }

    changeTheme(theme) {
        const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
        const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');
        themeLink.href = 'assets/theme/theme-' + theme + '.css';
        layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';
    }
}

@Component({
    selector: '[app-submenu]',
    template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}" *ngIf="child.visible === false ? false : true">
                <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" class="ripplelink" *ngIf="!child.routerLink" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i class="material-icons">{{child.icon}}</i>
                    <span>{{child.label}}</span>
                    <i class="material-icons" *ngIf="child.items">keyboard_arrow_down</i>
                </a>

                <a (click)="itemClick($event,child,i)" class="ripplelink" *ngIf="child.routerLink"
                    [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink" [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i class="material-icons">{{child.icon}}</i>
                    <span>{{child.label}}</span>
                    <i class="material-icons" *ngIf="child.items">keyboard_arrow_down</i>
                </a>
                <ul app-submenu [item]="child" *ngIf="child.items" [@children]="isActive(i) ? 'visible' : 'hidden'" [visible]="isActive(i)" [reset]="reset"></ul>
            </li>
        </ng-template>
    `,
    animations: [
        trigger('children', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})

export class AppSubMenuComponent {

    @Input() item: MenuItem;

    @Input() root: boolean;

    @Input() visible: boolean;

    _reset: boolean;

    activeIndex: number;

    constructor(@Inject(forwardRef(() => MainLayoutComponent)) public app: MainLayoutComponent,
        public router: Router, public location: Location) { }

    itemClick(event: Event, item: MenuItem, index: number) {
        // avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        // activate current item and deactivate active sibling if any
        this.activeIndex = (this.activeIndex === index) ? null : index;

        // execute command
        /*    if (item.command) {
               if (!item.eventEmitter) {
                   item.eventEmitter = new EventEmitter();
                   item.eventEmitter.subscribe(item.command);
               }
   
               item.eventEmitter.emit({
                   originalEvent: event,
                   item: item
               });
           } */

        // prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            event.preventDefault();
        }

        // hide menu
        if (!item.items) {
            if (this.app.isHorizontal()) {
                this.app.resetMenu = true;
            } else {
                this.app.resetMenu = false;
            }
            this.app.overlayMenuActive = false;
            this.app.staticMenuMobileActive = false;
        }
    }
    isActive(index: number): boolean {
        return this.activeIndex === index;
    }

    @Input() get reset(): boolean {
        return this._reset;
    }

    set reset(val: boolean) {
        this._reset = val;

        if (this._reset && this.app.isHorizontal()) {
            this.activeIndex = null;
        }
    }
}

/*
{
    label: this.menuGuardSrv.translate('_LABEL_'), icon: '', routerLink: ['#'],
    visible: this.menuGuardSrv.hideOrShow(['_ACTIVITY_'])
},*/
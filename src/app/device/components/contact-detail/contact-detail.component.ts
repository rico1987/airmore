import { Component, OnInit, Input, ApplicationRef, ComponentFactoryResolver, Injector, EmbeddedViewRef } from '@angular/core';
import { DeviceService, ModalService, MessageService } from '../../../shared/service';
import { SelectOption } from '../../../shared/components/dropdown-select-options/dropdown-select-options.component'
import { Contact } from '../../models';
import { DynamicInputComponent } from '../../../shared/components/dynamic-input/dynamic-input.component';
import { UploadFile } from '../../../shared/components/dynamic-input/interfaces';


const PhoneTypes: Array<SelectOption> = [
  {
    key: 1,
    label: '家庭电话',
    value: 1,
  },
  {
    key: 2,
    label: '移动电话',
    value: 2,
  },
  {
    key: 3,
    label: '单位电话',
    value: 3,
  },
  {
    key: 4,
    label: '单位传真',
    value: 4,
  },
  {
    key: 5,
    label: '住宅传真',
    value: 5,
  },
  {
    key: 7,
    label: '其他电话',
    value: 7,
  },
  {
    key: 0,
    label: '自定义',
    value: 0,
  },
];

const AddressTypes = [
  {
    key: 0,
    label: 'custom',
    value: 0
  },
  {
    key: 1,
    label: 'home',
    value: 1
  },
  {
    key: 2,
    label: 'work',
    value: 2
  },
  {
    key: 3,
    label: 'other',
    value: 3
  }
];

const EmailTypes = [
  {
    key: 0,
    label: 'custom',
    value: 0
  },
  {
    key: 1,
    label: 'home',
    value: 1
  },
  {
    key: 2,
    label: 'work',
    value: 2
  },
  {
    key: 3,
    label: 'other',
    value: 3
  },
  {
    key: 4,
    label: 'mobile',
    value: 4
  }
];

const ImTypes = [
  {
    key: 0,
    label: 'AIM',
    value: 0
  },
  {
    key: 1,
    label: 'MSN',
    value: 1
  },
  {
    key: 2,
    label: 'YaHoo',
    value: 2
  },
  {
    key: 3,
    label: 'Skype',
    value: 3
  },
  {
    key: 4,
    label: 'QQ',
    value: 4
  },
  {
    key: 5,
    label: 'Google Talk',
    value: 5
  },
  {
    key: 6,
    label: 'ICQ',
    value: 6
  },
  {
    key: 7,
    label: 'Jabber',
    value: 7
  },
  {
    key: 8,
    label: 'Net Meeting',
    value: 8
  },
];

const WebsiteTypes = [
  {
    key: 0,
    label: 'custom',
    value: 0
  },
  {
    key: 1,
    label: 'homepage',
    value: 1
  },
  {
    key: 2,
    label: 'blog',
    value: 2
  },
  {
    key: 3,
    label: 'account',
    value: 3
  },
  {
    key: 4,
    label: 'home',
    value: 4
  },
  {
    key: 5,
    label: 'work',
    value: 5
  },
  {
    key: 6,
    label: 'FTP',
    value: 6
  },
  {
    key: 7,
    label: 'other',
    value: 7
  },
];

const EventTypes = [
  {
    key: 0,
    label: 'custom',
    value: 0
  },
  {
    key: 1,
    label: 'anniversary',
    value: 1
  },
  {
    key: 2,
    label: 'other',
    value: 2
  },
  {
    key: 3,
    label: 'birthday',
    value: 3
  },
];

const ContactTemplate = {
  Name: {
      DisplayName: '',
  },
  Portrait: {
      Data: '',
  },
  GroupSelect: [],
  Organization: [{
    Company: '',
    Job: '',
  }],
  Phone: [],
  Address: [],
  Email: [],
  IM: [],
  Website: [],
  Event: [],
  Note: [{
    Content: '',
  }]
};

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {

  @Input() contact: any;

  private groups: Array<any>;

  private isEdit: boolean = false;

  private phoneTypes: Array<any> = PhoneTypes;

  private addressTypes: Array<any> = AddressTypes;

  private emailTypes: Array<any> = EmailTypes;

  private imTypes: Array<any> = ImTypes;

  private websiteTypes: Array<any> = WebsiteTypes;

  private eventTypes: Array<any> = EventTypes;

  private editingContact: Contact = Object.assign({}, ContactTemplate);

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private modalService: ModalService,
    private messageService: MessageService,
    private deviceService: DeviceService,
  ) { }

  ngOnInit() {
    this.groups = this.deviceService.tempContactsGroupList.concat();
  }


  edit(): void {
    console.log(this.contact);
    if (this.isEdit) {
      this.save();
    } else {
      if (!this.contact['Organization']) {
        this.contact['Organization'] = [{
          Company: '',
          Job: '',
        }];
      }
      if (!this.contact['Note']) {
        this.contact['Note'] = [{
          Content: '',
        }];
      }
      this.editingContact = this.contact;
    }
    this.isEdit = !this.isEdit;
  }

  // 删除联系人
  delete(): void {
    this.modalService.confirm({
      amTitle: 'Warning',
      amContent: '确定要删除这条记录吗？',
      amOnOk: () => {
          console.log(this.contact);
          this.deviceService.deleteContact(this.contact['AccountName'], this.contact['RawContactId'])
              .subscribe(
                  (data) => {
                      if (data) {
                          this.messageService.success('删除成功!');
                          this.deviceService.getItemList(false);
                      } else {
                          this.messageService.error('删除失败');
                      }
                  },
                  (error) => {
                      if (error) {
                          this.messageService.error('删除失败！');
                      }
                  },
                  () => {
                  }
              );
        }
    });
  }

  save(): void {
    if (this.deviceService.isAddingContact) {
      this.deviceService.addContact([this.editingContact])
        .subscribe(
            (data) => {
                if (data.length === 1) {
                  this.messageService.success('保存联系人成功！');
                } else {
                  this.messageService.error('保存联系人失败！');
                }
            },
            (error) => {
                if (error) {
                    this.messageService.error('保存联系人失败！');
                }
            },
            () => {
              this.isEdit = false;
              this.deviceService.isAddingContact = false;
              this.editingContact = Object.assign({}, ContactTemplate);
            }
        );
    } else {
      console.log(this.editingContact);
      this.deviceService.updateContact([this.editingContact])
        .subscribe(
            (data) => {
                if (data.length === 1) {
                  this.messageService.success('保存联系人成功！');
                  this.editingContact = Object.assign({}, ContactTemplate);
                } else {
                  this.messageService.error('保存联系人失败！');
                }
            },
            (error) => {
                if (error) {
                    this.messageService.error('保存联系人失败！');
                }
            },
            () => {
              this.isEdit = false;
              this.editingContact = Object.assign({}, ContactTemplate);
            }
        );
    }
  }
  
  messageTo(phone: string): void {

  }

  callTo(phone: string): void {
    this.deviceService.call(phone)
      .subscribe((res) => {
        if (res) {
          this.messageService.info('请在手机上完成拨打电话步骤.');
        } else {
          this.messageService.error('呼叫失败！');
        }
      })
  }

  cancel(): void {
    this.isEdit = false;
    this.deviceService.isAddingContact = false;
  }

  updatePortrait(): void {
    const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(DynamicInputComponent)
            .create(this.injector);

        componentRef.instance.options = {
            multiple: false,
        };
        
        this.appRef.attachView(componentRef.hostView);

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;
        
        document.body.appendChild(domElem);

        componentRef.instance.onFileChange = (fileList: UploadFile[]) => {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent) => {
              this.editingContact['Portrait'] = {
                Data: (event.currentTarget as FileReader).result as string,
              }
            }
            reader.readAsDataURL(fileList[0] as any);
        };

        componentRef.instance.onClick();
  }

  deletePortrait(): void {
    this.editingContact['Portrait'] = {
      Data: null,
    };
  }

  addItem(type: string): void {
    if (!this.editingContact[type]) {
      this.editingContact[type] = [];
    }
    if (type === 'Address') {
      this.editingContact[type].push({
        Type: 1,
        Street: null,
      });
    } else if (type === 'Website') {
      this.editingContact[type].push({
        Type: 1,
        Url: null,
      });
    } else if (type === 'Event') {
      this.editingContact[type].push({
        Type: 1,
        StartDate: null,
      });
    } else {
      this.editingContact[type].push({
        Type: 1,
        Name: null,
      });
    }
  }

  onSelectGroupChange(selectedOptions: Array<any>): void {
    this.editingContact['Groups'] = selectedOptions.concat();
    console.log(selectedOptions);
    console.log(this.deviceService.contactGroupList);

  }

  getPhoneType(type: number): string {
    return PhoneTypes.find((ele) => ele.key === type)['label'];
  }

  getAddressType(type: number): string {
    return AddressTypes.find((ele) => ele.key === type)['label'];
  }

  getImType(type: number): string {
    return ImTypes.find((ele) => ele.key === type)['label'];
  }

  getWebsiteType(type: number): string {
    return WebsiteTypes.find((ele) => ele.key === type)['label'];
  }

  getEventType(type: number): string {
    return EventTypes.find((ele) => ele.key === type)['label'];
  }
}

import { Directive, ComponentFactory, ComponentRef, Input, TemplateRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { LoadingComponent } from '../components/loading/loading.component';

@Directive({
  selector: '[appLoading]'
})
export class LoadingDirective {

  loadingFactory : ComponentFactory<LoadingComponent>;
  loadingComponent : ComponentRef<LoadingComponent>;

  constructor(
    private templateRef: TemplateRef<any>,
    private vcRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    // Create resolver for loading component
    this.loadingFactory = this.componentFactoryResolver.resolveComponentFactory(LoadingComponent);
  }


  @Input() 
  set apploading(loading: boolean) {
    this.vcRef.clear();

    console.log(loading);
    if (loading)
    {
      // create and embed an instance of the loading component
      this.loadingComponent = this.vcRef.createComponent(this.loadingFactory);
    }
    else
    {
      // embed the contents of the host template
      this.vcRef.createEmbeddedView(this.templateRef);
    }    
  }

}

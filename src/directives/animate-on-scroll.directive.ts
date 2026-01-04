import { Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appAnimateOnScroll]',
  standalone: true,
})
export class AnimateOnScrollDirective implements OnInit {
  private elementRef = inject(ElementRef<HTMLElement>);

  ngOnInit(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.elementRef.nativeElement.classList.add('is-visible');
          obs.unobserve(this.elementRef.nativeElement);
        }
      });
    }, options);

    observer.observe(this.elementRef.nativeElement);
  }
}

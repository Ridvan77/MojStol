import { Component } from '@angular/core';
import { PublicNavbarComponent } from "../../Core/Navbar/public-navbar/public-navbar.component";
import { FooterComponent } from "../../Core/Footer/footer/footer.component";
import { RouterModule } from "@angular/router";


@Component({
  selector: 'app-public-layout',
  imports: [PublicNavbarComponent, FooterComponent, RouterModule],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent {

}

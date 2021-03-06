import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PostsService } from './../../../../services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from './../../../../interfaces/post';

@Component({
  selector: 'app-post-categorie',
  templateUrl: './post-categorie.component.html',
  styleUrls: ['./post-categorie.component.css']
})
export class PostCategorieComponent implements OnInit {

  public page: number;
  public nbpage: number;
  public posts: Array<Post>;
  public loading: Boolean;
  public disabled: Boolean;
  public pages: Array<number>;
  private url: String;
  public categorie: String;
  public categorieId: number;
  private currentPage: String;
  private loop: Boolean;

    constructor(
                private titleService: Title,
                private service: PostsService,
                private route: ActivatedRoute
              ) {
                this.loop = true;
                this.pages = [];
                this.getPage();
              }

    private setTitle( newTitle: string): void {
      this.titleService.setTitle( newTitle );
    }

    ngOnInit() {

      this.route.params.subscribe((params) => {
        this.categorie = params.categorie;
        this.categorieId = params.category_id;
        this.setTitle(`${params.categorie}`);
        if ( this.url !== params.category_id || this.currentPage !== params.page ) {
          this.loading = true;
          this.getPage();
          this.getAll().then((data) => {
            if (this.url !== params.category_id) {
              this.pages = [];
              this.loop = true;
            }
          if (this.loop) {
            for (let i = 1; i <= data.nbpage; i++) {
              this.pages.push(i);
            }
          }
          if (this.url !== params.category_id) {
            this.loop = false;
          }
            this.posts = data.art;
            this.loading = false;
            this.disabled = this.page < data.nbpage ? false : true;
          });
        }

      });

    }

    private getPage (): void {

      this.route.params.subscribe((params) => {
        this.page = isNaN(params.page) || params.page <= 0 ? 1 : Math.ceil(params.page);
      });

    }

    private getAll (): Promise<any> {
      return new Promise((resolve, reject) => {
        this.route.params.subscribe((params) => {
          this.service.getAllFromCategorie(params.category_id, this.page).then((data) => {
            resolve (data);
          }, (err) => {
            reject(err);
          });
        });

      });

    }

}

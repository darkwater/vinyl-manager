import { Component, OnInit } from "@angular/core";
import { Repository } from "../repository";
import { ManagerService } from "../manager.service";

@Component({
    selector:    "app-repositories",
    templateUrl: "./repositories.component.html",
    styleUrls:   ["./repositories.component.scss"],
})
export class RepositoriesComponent implements OnInit {

    repos: Repository[];

    selectedRepo: Repository;

    constructor(private managerService: ManagerService) { }

    ngOnInit() {
        this.getRepositories();
    }

    getRepositories() {
        this.managerService.getRepositories()
            .subscribe(repos => this.repos = repos);
    }

    onSelect(repo: Repository) {
        this.selectedRepo = repo;
    }

    saveSelected() {
        this.managerService.updateRepository(this.selectedRepo)
            .subscribe(() => this.selectedRepo = null);
    }

}

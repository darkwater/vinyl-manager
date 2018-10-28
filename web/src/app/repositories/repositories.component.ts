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
    newRepo:      Repository;

    constructor(private managerService: ManagerService) { }

    ngOnInit() {
        this.getRepositories();
    }

    getRepositories() {
        this.selectedRepo = null;
        this.newRepo      = null;

        this.managerService.getRepositories()
            .subscribe(repos => this.repos = repos);
    }

    onSelect(repo?: Repository) {
        if (repo == this.selectedRepo) return;

        this.selectedRepo = repo;
    }

    onSaveSelected() {
        this.managerService.updateRepository(this.selectedRepo)
            .subscribe(() => this.getRepositories());
    }

    onDelete() {
        this.managerService.deleteRepository(this.selectedRepo)
            .subscribe(() => this.getRepositories());
    }

    onNew() {
        const new_repo = new Repository();
        this.repos.push(new_repo);
        this.newRepo = new_repo;
    }

    onSaveNew() {
        this.managerService.createRepository(this.newRepo)
            .subscribe(() => this.getRepositories());
    }

    onCancel() {
        this.selectedRepo = null;
        this.newRepo      = null;

        this.repos = this.repos.filter(repo => repo.id != null || repo == this.selectedRepo);
    }

}

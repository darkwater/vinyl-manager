#![feature(plugin)]
#![plugin(rocket_codegen)]

#[macro_use] extern crate diesel;

mod db;
mod schema;

use crate::db::*;
use diesel::prelude::*;
use rocket::fairing::AdHoc;
use rocket::http::{Method, Status};
use rocket::http::hyper::header;
use rocket_contrib::Json;

type Response<T> = Result<Json<T>, Status>;

#[get("/repositories")]
fn get_repositories(conn: DbConn) -> Response<Vec<Repository>> {
    use crate::schema::repositories::dsl::*;

    let res = repositories
        .load(&*conn)
        .map_err(|_| Status::InternalServerError)?;

    Ok(Json(res))
}

#[put("/repositories/<repo_id>", data = "<repo>")]
fn update_repository(repo_id: i32, repo: Json<UpdateRepository>, conn: DbConn) -> Result<(), Status> {
    use crate::schema::repositories::dsl::*;

    diesel::update(repositories.find(repo_id))
        .set(&*repo)
        .execute(&*conn)
        .map(|_| ())
        .map_err(|_| Status::InternalServerError)
}

fn main() {
    rocket::Rocket::ignite()
        .manage(db::get_conn())
        .mount("/", routes![
            get_repositories,
            update_repository,
        ])
        .attach(AdHoc::on_response(|req, res| {
            res.set_header(header::AccessControlAllowOrigin::Value("http://localhost:4200".to_string()));

            if req.method() == Method::Options && res.status() == Status::NotFound {
                res.set_status(Status::Ok);
                res.set_raw_header("Access-Control-Allow-Headers", "Content-Type");
                res.set_raw_header("Access-Control-Allow-Methods", "HEAD,GET,PUT,POST,DELETE,OPTIONS");
                res.take_body();
            }
        }))
        .launch();
}

use diesel::prelude::*;
use diesel_derives::*;
use rocket::http::Status;
use rocket::request::{self, FromRequest};
use rocket::{Request, State, Outcome};
use serde_derive::*;
use std::ops::Deref;
use std::sync::{Mutex, MutexGuard};

pub struct DbConn<'r>(pub MutexGuard<'r, SqliteConnection>);

impl<'a, 'r> FromRequest<'a, 'r> for DbConn<'r> {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<Self, Self::Error> {
        let mutex = request.guard::<State<Mutex<SqliteConnection>>>()?;
        match mutex.inner().lock() {
            Ok(conn) => Outcome::Success(DbConn(conn)),
            Err(_)   => Outcome::Failure((Status::ServiceUnavailable, ())),
        }
    }
}

impl<'r> Deref for DbConn<'r> {
    type Target = SqliteConnection;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

pub fn get_conn() -> Mutex<SqliteConnection> {
    let database_url = "dev.db";
    let conn = SqliteConnection::establish(&database_url).expect("error opening database");

    Mutex::new(conn)
}

use crate::schema::repositories;
#[derive(Queryable, Serialize)]
pub struct Repository {
    id:   i32,
    host: String,
    path: String,
}

#[derive(AsChangeset, Deserialize)]
#[table_name="repositories"]
pub struct UpdateRepository {
    host: String,
    path: String,
}

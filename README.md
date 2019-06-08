# Switch between different MySQL / MariaDB environments

## MyCnfManager enables handling multiple my.cnf

### Usage

Just create a `~/.my.cnf.clients` file containing all possible environments, e.g.:

```
[default]
host=127.0.0.1
port=3306
[local]
user=root
password=secret
[rails]
port=3308
database=rails_project_development
```

Now you can switch between different clients with `my.cnf.manager name_of_environment`:

```sh
  $ my.cnf.manager local
    switched .my.cnf to local
  # to check what my.cnf.manager has actually done:
  $ cat ~/.my.cnf
    [client]
    user=root
    host=127.0.0.1
    port=3306
    password=secret
  $ my.cnf.manager
    switched .my.cnf to default
```

### License

MIT

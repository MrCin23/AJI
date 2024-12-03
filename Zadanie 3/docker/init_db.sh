#!/bin/bash

psql -U aji -d computer_shop -f "./initstructure/cleanup.sql"
psql -U aji -d computer_shop -f "./initstructure/order_status.sql"
psql -U aji -d computer_shop -f "./initstructure/category.sql"
psql -U aji -d computer_shop -f "./initstructure/product.sql"
psql -U aji -d computer_shop -f "./initstructure/orders.sql"
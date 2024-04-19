
<p align="center">
    <em>Invoice manager and invoice generator</em>
</p>
<p align="center">

</p>
<p align="center">
    <h1>v1.0.0</h1>
</p>
---


![Alt Text](/assets/invoicelist.png)

![Alt Text](/assets/invoicedetails.png)

![Alt Text](/assets/createinvoice.png)

![Alt Text](/assets/invoicelistopen.png)

![Alt Text](/assets/accountdetail.png)

![Alt Text](/assets/createcompany.png)

![Alt Text](/assets/companieslist.png)

![Alt Text](/assets/companydetail.png)


## Dev installation

### Using docker:
```shell
docker-compose up --build
```
Note: You need to have the desktop Docker app, download it from https://docs.docker.com/get-docker/

Note: After you run the containers, you need to enter django_app container's cli, and create
superuser.
use `docker exec -it django_app sh` to enter inside the container's terminal
then `python manage.py createsuperuser` to create a user

lastlly open this link on your browser `localhost:3000`.<br />
## Technologies used



- Django
- Javascript with react
- database, right now sqlite
- Docker as a main packaging system, which makes development OS-agnostic and simplified the setup process



TO CONTACT ME SEND EMAIL ON forprokm@gmail.com
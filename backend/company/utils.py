def get_avatar_filepath(self, filename):
    return f"avatars/{str(self.owner.pk)}/{str(self.slug)}/avatar.png"


def get_default_avatar():
    return "images/default/default.jpg"


def add_company_data_to_response(company, context):
    context["id"] = company.id
    context["owner"] = company.owner.username
    context["name"] = company.name
    context["about"] = company.about
    context["email"] = company.email
    context["number"] = company.number
    context["address"] = company.address
    context["slug"] = company.slug
    context["avatar"] = company.avatar.url
    return context

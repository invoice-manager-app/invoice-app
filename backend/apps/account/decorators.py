from django.shortcuts import redirect


def unauthenticated_user(view_func):
    def wrapper_func(request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect("home")
        else:
            return view_func(request, *args, **kwargs)

    return wrapper_func


# # to specfid how can acsess the view
# def allowed_users(allowed_rolse=[]):
#     def decorator(view_func):
#         def wrapper_func(request, *args, **kwargs):
#             groups = None
#             if request.user.groups.exists():
#                 #groups = request.user.groups.all()[0].name
#                 groups = request.user.groups.all()
#             for group in groups:
#                 if group.name in allowed_rolse:
#                     return view_func(request, *args, **kwargs)
#             else:
#                 return HttpResponse('you canot view this page')
#         return wrapper_func
#     return decorator


# @allowed_users(allowed_rolse=['admin','teacher'])

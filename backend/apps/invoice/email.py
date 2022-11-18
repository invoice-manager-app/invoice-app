from apps.account.mail import BaseEmailMessage


class InvoiceDetailEmail(BaseEmailMessage):
    template_name = "invoice_email_detail.html"

    def get_context_data(self):
        # activation_url = "activate-account/{uid}/{token}"
        context = super().get_context_data()
        invoice = context.get("invoice")
        context["invoice"] = invoice
        # context["url"] = activation_url.format(**context)
        return context


class InvoiceReminderEmail(BaseEmailMessage):
    template_name = "invoice_reminder.html"

    def get_context_data(self):
        # activation_url = "activate-account/{uid}/{token}"
        context = super().get_context_data()
        invoice = context.get("invoice")
        context["invoice"] = invoice
        # context["url"] = activation_url.format(**context)
        return context

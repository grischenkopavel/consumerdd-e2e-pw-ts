# The most common web application test layers overview

- UI layer (user interaction wia UI interface)
- API layer (how it does work "under the hood")
- Database layer (store data)

> [!CAUTION]
>
> - flaky UI test example: tests\search.dealername.param.spec -> 'caruso' {timeout: 3000 -> 500ms}
> - API tests are more stable and faster than UI tests

> [!NOTE]
>
> # Notes for the DEV team
>
> - need "id" or "data-testid" for the most important HTML elements (buttons, text boxes, check boxes, etc ). Good example Consumer DD - hard to find solid CSS/XPath for search dealer card {div[class*="dealer-card"] p[class*="heading6"]}. By the way for the API tests its' not needed

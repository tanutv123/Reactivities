using FluentValidation;

namespace Application.Profiles
{
    public class EditProfileValidator : AbstractValidator<EditProfileDto>
    {
        public EditProfileValidator() 
        {
            RuleFor(x => x.DisplayName).NotEmpty();
        }
    }
}
